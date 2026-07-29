/*
  Warnings:

  - A unique constraint covering the columns `[idempotency_key]` on the table `practice_results` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idempotency_key]` on the table `practice_sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idempotency_key` to the `practice_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idempotency_key` to the `practice_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "practice_results" ADD COLUMN     "idempotency_key" UUID NOT NULL;

-- AlterTable
ALTER TABLE "practice_sessions" ADD COLUMN     "idempotency_key" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "practice_results_idempotency_key_key" ON "practice_results"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "practice_sessions_idempotency_key_key" ON "practice_sessions"("idempotency_key");
