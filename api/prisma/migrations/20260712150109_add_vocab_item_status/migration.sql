-- CreateEnum
CREATE TYPE "VocabularyItemStatus" AS ENUM ('LEARNING', 'MASTERED');

-- AlterTable
ALTER TABLE "vocabulary_list_items" ADD COLUMN     "status" "VocabularyItemStatus" NOT NULL DEFAULT 'LEARNING';
