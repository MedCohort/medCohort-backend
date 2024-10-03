-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'client';
