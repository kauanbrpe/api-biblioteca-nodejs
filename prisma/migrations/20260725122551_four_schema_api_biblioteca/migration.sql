/*
  Warnings:

  - The values [DELETED] on the enum `statusLoanEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "statusLoanEnum_new" AS ENUM ('ACTIVE', 'RETURNED', 'OVERDUE');
ALTER TABLE "public"."loans" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "loans" ALTER COLUMN "status" TYPE "statusLoanEnum_new" USING ("status"::text::"statusLoanEnum_new");
ALTER TYPE "statusLoanEnum" RENAME TO "statusLoanEnum_old";
ALTER TYPE "statusLoanEnum_new" RENAME TO "statusLoanEnum";
DROP TYPE "public"."statusLoanEnum_old";
ALTER TABLE "loans" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;
