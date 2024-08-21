-- CreateTable
CREATE TABLE memory (
    user_id integer primary key,
    memory_id uuid not null,
    content text not null
);

-- CreateIndex
-- CREATE INDEX "idx_user_id" ON "memory"("user_id");

-- CreateIndex
-- CREATE INDEX "memory_embedding_idx" ON "memory"("embedding");
