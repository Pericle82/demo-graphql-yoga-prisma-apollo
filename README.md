# demo-graphql-yoga-prisma-apollo

## Updating Prisma Client

This is a great time to refresh your memory on the workflow we described for your project at the end of chapter 4!
After every change you make to the data model, you need to migrate your database and then re-generate Prisma Client.
In the root directory of the project, run the following command:

```shell
npx prisma migrate dev --name "add-comment-model"
```

## Populate db


```shell
npx ts-node src/script.ts
```