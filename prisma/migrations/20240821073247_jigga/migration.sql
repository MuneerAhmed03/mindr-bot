/*
  Warnings:

  - The primary key for the `memory` table will be changed. If it partially fails, the table could be left without primary key constraint.

-- */
-- -- AlterTable
-- ALTER TABLE "memory" DROP CONSTRAINT "memory_pkey",
-- ADD COLUMN     "embedding" vector,
-- ADD CONSTRAINT "memory_pkey" PRIMARY KEY ("memory_id");

-- -- CreateIndex
-- CREATE INDEX "idx_user_id" ON "memory"("user_id");

-- -- CreateIndex
-- CREATE INDEX "memory_embedding_idx" ON "memory"("embedding");
