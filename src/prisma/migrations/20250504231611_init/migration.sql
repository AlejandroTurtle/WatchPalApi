/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `nome` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- AlterTable
ALTER TABLE "User" ADD COLUMN "nome" TEXT;

-- Atualizar os valores da coluna nome
UPDATE "User" SET "nome" = "name";

-- Remover a coluna name
ALTER TABLE "User" DROP COLUMN "name";

-- Tornar a coluna nome obrigatória
ALTER TABLE "User" ALTER COLUMN "nome" SET NOT NULL;

-- Adicionar as colunas celular e foto
ALTER TABLE "User" ADD COLUMN "celular" TEXT;
ALTER TABLE "User" ADD COLUMN "foto" TEXT;