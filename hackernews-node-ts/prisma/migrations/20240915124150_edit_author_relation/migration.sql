/*
  Warnings:

  - A unique constraint covering the columns `[name,photo,id]` on the table `Author` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorName` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorPhoto` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Track" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "modulesCount" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorPhoto" TEXT NOT NULL,
    CONSTRAINT "Track_authorId_authorName_authorPhoto_fkey" FOREIGN KEY ("authorId", "authorName", "authorPhoto") REFERENCES "Author" ("id", "name", "photo") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Track" ("authorId", "createdAt", "id", "length", "modulesCount", "thumbnail", "title") SELECT "authorId", "createdAt", "id", "length", "modulesCount", "thumbnail", "title" FROM "Track";
DROP TABLE "Track";
ALTER TABLE "new_Track" RENAME TO "Track";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_photo_id_key" ON "Author"("name", "photo", "id");
