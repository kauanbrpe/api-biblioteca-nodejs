/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "roleEnum" AS ENUM ('USER', 'ADMIN');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "statusEnum" ADD VALUE 'CANCELED';
ALTER TYPE "statusEnum" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "roleEnum" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "isAdmin";
