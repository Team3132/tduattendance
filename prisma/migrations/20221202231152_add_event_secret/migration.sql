/*
  Warnings:

  - A unique constraint covering the columns `[secret]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - The required column `secret` was added to the `Event` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "secret" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "defaultStatus" "RSVPStatus" NOT NULL DEFAULT 'NO';

-- CreateIndex
CREATE UNIQUE INDEX "Event_secret_key" ON "Event"("secret");
