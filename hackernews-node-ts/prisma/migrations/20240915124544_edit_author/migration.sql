/*
  Warnings:

  - You are about to drop the column `authorName` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `authorPhoto` on the `Track` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Author` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Author_name_photo_id_key";

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
    CONSTRAINT "Track_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Track" ("authorId", "createdAt", "id", "length", "modulesCount", "thumbnail", "title") SELECT "authorId", "createdAt", "id", "length", "modulesCount", "thumbnail", "title" FROM "Track";
DROP TABLE "Track";
ALTER TABLE "new_Track" RENAME TO "Track";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Author_id_key" ON "Author"("id");
