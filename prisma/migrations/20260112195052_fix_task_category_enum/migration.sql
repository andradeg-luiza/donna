/*
  Warnings:

  - The `category` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('Compras', 'Trabalho', 'Estudos', 'Saude', 'Financeiro', 'Casa', 'Pessoal', 'Outros');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "category",
ADD COLUMN     "category" "TaskCategory";
