/*
  Warnings:

  - You are about to drop the column `idempotency_key` on the `practice_results` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[session_id,item_id,started_at]` on the table `practice_results` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "practice_results_idempotency_key_key";

-- AlterTable
ALTER TABLE "practice_results" DROP COLUMN "idempotency_key";

-- CreateIndex
CREATE UNIQUE INDEX "practice_results_session_id_item_id_started_at_key" ON "practice_results"("session_id", "item_id", "started_at");
