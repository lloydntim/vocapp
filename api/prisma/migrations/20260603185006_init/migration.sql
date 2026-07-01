-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('LTR', 'RTL');

-- CreateEnum
CREATE TYPE "TokenPurpose" AS ENUM ('password_reset', 'account_verification');

-- CreateEnum
CREATE TYPE "UserPlan" AS ENUM ('PAID', 'FREE');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "plan" "UserPlan" NOT NULL DEFAULT 'FREE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentials" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "purpose" "TokenPurpose" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "direction" "Direction" NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_lists" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "source_language_id" UUID NOT NULL,
    "target_language_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_list_items" (
    "id" UUID NOT NULL,
    "list_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "source_text" TEXT NOT NULL,
    "target_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_list_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_results" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "item_id" UUID,
    "source_text" TEXT NOT NULL,
    "target_text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "practice_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "list_id" UUID NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_user_id_key" ON "credentials"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_revoked_at_idx" ON "refresh_tokens"("revoked_at");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_hash_key" ON "tokens"("token_hash");

-- CreateIndex
CREATE INDEX "tokens_user_id_purpose_idx" ON "tokens"("user_id", "purpose");

-- CreateIndex
CREATE INDEX "tokens_purpose_idx" ON "tokens"("purpose");

-- CreateIndex
CREATE INDEX "tokens_expires_at_idx" ON "tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_user_id_purpose_key" ON "tokens"("user_id", "purpose");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "languages"("code");

-- CreateIndex
CREATE INDEX "vocabulary_lists_user_id_idx" ON "vocabulary_lists"("user_id");

-- CreateIndex
CREATE INDEX "vocabulary_lists_source_language_id_idx" ON "vocabulary_lists"("source_language_id");

-- CreateIndex
CREATE INDEX "vocabulary_list_items_list_id_idx" ON "vocabulary_list_items"("list_id");

-- CreateIndex
CREATE UNIQUE INDEX "vocabulary_list_items_list_id_position_key" ON "vocabulary_list_items"("list_id", "position");

-- CreateIndex
CREATE INDEX "practice_results_session_id_idx" ON "practice_results"("session_id");

-- CreateIndex
CREATE INDEX "practice_results_item_id_idx" ON "practice_results"("item_id");

-- CreateIndex
CREATE INDEX "practice_results_is_correct_idx" ON "practice_results"("is_correct");

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_lists" ADD CONSTRAINT "vocabulary_lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_lists" ADD CONSTRAINT "vocabulary_lists_source_language_id_fkey" FOREIGN KEY ("source_language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_lists" ADD CONSTRAINT "vocabulary_lists_target_language_id_fkey" FOREIGN KEY ("target_language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_list_items" ADD CONSTRAINT "vocabulary_list_items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "vocabulary_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_results" ADD CONSTRAINT "practice_results_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "practice_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_results" ADD CONSTRAINT "practice_results_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "vocabulary_list_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "vocabulary_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
