// this script is used to test the connection to the database

// 1
import { PrismaClient } from '@prisma/client'

// 2
const prisma = new PrismaClient()

const createAuthors = async () => {
  const authors = [];
  for (let i = 0; i < 10; i++) {
    const newAuthor = await prisma.author.create({
      data: {
        name: `John Doe ${i}`,
        photo: 'https://cloudinary.com/johndoe'
      }
    });
    console.log(newAuthor);
    authors.push(newAuthor);
  }
  return authors;
};

const createTracks = async () => {
  // Ensure related records exist and get the created authors
  const authors = await createAuthors();

  for (let i = 0; i < 10; i++) {
    const newTrack = await prisma.track.create({
      data: {
        title: `Track ${i}`,
        thumbnail: 'https://cloudinary.com/track',
        length: 1200,
        modulesCount: 6,
        authorId: authors[i].id
      }
    });
    console.log(newTrack);
  }
};

const createCommets = async () => {
  const comments = [];
  for (let i = 0; i < 10; i++) {
    const newComment = await prisma.comment.create({
      data: {
        body: `Comment ${i}`
      }
    });
    console.log(newComment);
    comments.push(newComment);
  }
  return comments;
}

const createLink = async () => {
  const comments = await createCommets();

  for (let i = 0; i < 10; i++) {
    const newLink = await prisma.link.create({
      data: {
        description: `Link ${i}`,
        url: 'https://cloudinary.com/link',
        comments: {
          create: {
            body: comments[i].body
          }
        }
      }
    });
    console.log(newLink);
  }

};



const main = async () => {
  await createTracks();
  await createLink();

  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
};

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});