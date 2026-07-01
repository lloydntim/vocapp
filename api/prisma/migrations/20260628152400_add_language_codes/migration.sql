/*
  Warnings:

  - You are about to drop the column `is_correct` on the `practice_results` table. All the data in the column will be lost.
  - Added the required column `started_at` to the `practice_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_language_code` to the `vocabulary_lists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_language_code` to the `vocabulary_lists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "vocabulary_lists" DROP CONSTRAINT "vocabulary_lists_source_language_id_fkey";

-- DropForeignKey
ALTER TABLE "vocabulary_lists" DROP CONSTRAINT "vocabulary_lists_target_language_id_fkey";

-- DropIndex
DROP INDEX "practice_results_is_correct_idx";

-- AlterTable
ALTER TABLE "practice_results" DROP COLUMN "is_correct",
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "errors" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "skipped" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "practice_sessions" ADD COLUMN     "totalErrors" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalHints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSkipped" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "vocabulary_lists" ADD COLUMN     "source_language_code" TEXT NOT NULL,
ADD COLUMN     "target_language_code" TEXT NOT NULL,
ALTER COLUMN "source_language_id" DROP NOT NULL,
ALTER COLUMN "target_language_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "vocabulary_lists" ADD CONSTRAINT "vocabulary_lists_source_language_id_fkey" FOREIGN KEY ("source_language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_lists" ADD CONSTRAINT "vocabulary_lists_target_language_id_fkey" FOREIGN KEY ("target_language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
