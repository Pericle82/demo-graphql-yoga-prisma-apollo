import { createSchema } from 'graphql-yoga'
import { Prisma, Track, type Link } from '@prisma/client'
import type { GraphQLContext } from './context'
import { GraphQLError } from 'graphql'

const typeDefinitions = /* GraphQL */ `
type Track {
  id: ID!
  title: String!
  thumbnail: String
  length: Int
  modulesCount: Int
  author: Author 
}

type Author {
  id: ID!
  name: String!
  photo: String
}

type Link {
  id: ID!
  description: String!
  url: String!
  comments: [Comment!]!
}
 
type Comment {
  id: ID!
  body: String!
}
 
type Query {
  info: String!
  feed(filterNeedle: String, skip: Int, take: Int): [Link!]!
  comment(id: ID!): Comment
  getTrack(id: ID!): Track
  getTracks: [Track]
  getAuthors: [Author]
}
 
type Mutation {
  postLink(url: String!, description: String!): Link!
  postCommentOnLink(linkId: ID!, body: String!): Comment!
}
`

const parseIntSafe = (value: string): number | null => {
  if (/^(\d+)$/.test(value)) {
    return parseInt(value, 10)
  }
  return null
}

const applyTakeConstraints = (params: { min: number; max: number; value: number }) => {
  if (params.value < params.min || params.value > params.max) {
    throw new GraphQLError(
      `'take' argument value '${params.value}' is outside the valid range of '${params.min}' to '${params.max}'.`
    )
  }
  return params.value
}

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (
      parent: unknown,
      args: { filterNeedle?: string, skip?: number, take?: number, },
      context: GraphQLContext) => {
      const where = args.filterNeedle ? {
        OR: [
          { description: { contains: args.filterNeedle } },
          { url: { contains: args.filterNeedle } }
        ]
      } : {}
      const take = applyTakeConstraints({
        min: 1,
        max: 50,
        value: args.take ?? 30
      })

      return context.prisma.link.findMany({
        where,
        skip: args.skip,
        take
      })
    },
    async comment(parent: unknown, args: { id: string }, context: GraphQLContext) {
      return context.prisma.comment.findUnique({
        where: { id: parseInt(args.id) }
      })
    },
    async getTrack(parent: unknown, args: { id: string }, context: GraphQLContext) {
      return context.prisma.track.findUnique({
        where: { id: parseInt(args.id) }
      })
    },
    async getTracks(parent: unknown, args: {}, context: GraphQLContext) {
      return context.prisma.track.findMany()
    },
    async getAuthors(parent: unknown, args: {}, context: GraphQLContext) {
      return context.prisma.author.findMany()
    }
  },
  Track: {
    id: (parent: Track) => parent.id,
    title: (parent: Track) => parent.title,
    thumbnail: (parent: Track) => parent.thumbnail,
    length: (parent: Track) => parent.length,
    modulesCount: (parent: Track) => parent.modulesCount,
    author(parent: Track, args: {}, context: GraphQLContext) {
      return context.prisma.author.findUnique({
        where: { id: parent.authorId }
      })
    }
  },
  Link: {
    id: (parent: Link) => parent.id,
    description: (parent: Link) => parent.description,
    url: (parent: Link) => parent.url,
    comments(parent: Link, args: {}, context: GraphQLContext) {
      return context.prisma.comment.findMany({
        where: {
          linkId: parent.id
        }
      })
    }
  },
  Mutation: {
    async postLink(
      parent: unknown,
      args: { description: string; url: string },
      context: GraphQLContext
    ) {
      const newLink = await context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description
        }
      })
      return newLink
    },
    async postCommentOnLink(
      parent: unknown,
      args: { linkId: string; body: string },
      context: GraphQLContext
    ) {
      const linkId = parseIntSafe(args.linkId)
      if (linkId === null) {
        return Promise.reject(
          new GraphQLError(`Cannot post comment on non-existing link with id '${args.linkId}'.`)
        )
      }
      const newComment = await context.prisma.comment.create({
        data: {
          linkId: parseInt(args.linkId),
          body: args.body
        }
      }).catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
          return Promise.reject(
            new GraphQLError(`Cannot post comment on non-existing link with id '${args.linkId}'.`)
          )
        }
        return Promise.reject(err)
      })

      return newComment
    }
  }
}

export const schema = createSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})
