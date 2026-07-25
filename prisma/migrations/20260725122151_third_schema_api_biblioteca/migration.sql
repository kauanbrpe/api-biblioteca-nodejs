/*
  Warnings:

  - The `status` column on the `loans` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "statusLoanEnum" AS ENUM ('ACTIVE', 'RETURNED', 'OVERDUE', 'DELETED');

-- CreateEnum
CREATE TYPE "statusUserEnum" AS ENUM ('ACTIVE', 'DISABLED');

-- AlterTable
ALTER TABLE "loans" DROP COLUMN "status",
ADD COLUMN     "status" "statusLoanEnum" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "statusUserEnum" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "statusEnum";
