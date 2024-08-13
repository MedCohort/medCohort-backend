-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Deadline" AS ENUM ('DEFAULT_DEADLINE', 'TWELVE_HOURS', 'TWENTY_FOUR_HOURS', 'TWO_DAYS', 'THREE_DAYS', 'FIVE_DAYS', 'SEVEN_DAYS', 'FOURTEEN_DAYS');

-- CreateEnum
CREATE TYPE "Discipline" AS ENUM ('ONE', 'TWO', 'THREE');

-- CreateEnum
CREATE TYPE "Education" AS ENUM ('BACHELOR', 'MASTER', 'PHD');

-- CreateEnum
CREATE TYPE "Format" AS ENUM ('APA', 'MLA', 'CHICAGO');

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "fullNames" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "activeStatus" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Writer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "Writer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Support" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Support_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" "Deadline" NOT NULL DEFAULT 'DEFAULT_DEADLINE',
    "instructions" TEXT NOT NULL,
    "files" TEXT,
    "pages" INTEGER NOT NULL,
    "typeOfPaper" TEXT NOT NULL,
    "discipline" "Discipline" NOT NULL DEFAULT 'ONE',
    "qualityLevel" "Education" NOT NULL DEFAULT 'BACHELOR',
    "format" "Format" NOT NULL DEFAULT 'APA',
    "sources" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delegation" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "writerId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,
    "delegationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "remarks" TEXT,
    "submissionDate" TIMESTAMP(3),
    "reviewDate" TIMESTAMP(3),

    CONSTRAINT "Delegation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Writer_email_key" ON "Writer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Support_email_key" ON "Support"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Delegation_assignmentId_key" ON "Delegation"("assignmentId");

-- AddForeignKey
ALTER TABLE "Writer" ADD CONSTRAINT "Writer_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delegation" ADD CONSTRAINT "Delegation_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delegation" ADD CONSTRAINT "Delegation_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "Writer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delegation" ADD CONSTRAINT "Delegation_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
