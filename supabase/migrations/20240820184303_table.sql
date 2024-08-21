-- Drop the old table if it exists (optional if you want to fully rebuild the table)
DROP TABLE IF EXISTS memory;

-- Create the memory table without user_id as the primary key
CREATE TABLE memory (
    memory_id uuid PRIMARY KEY, -- Use memory_id as the primary key
    user_id integer NOT NULL,   -- Keep user_id as a foreign key, not the primary key
    content text NOT NULL,
    embedding vector(384)
);

-- Optionally, you could create a composite key with both user_id and memory_id
-- PRIMARY KEY (user_id, memory_id)

-- Create an index for the embedding column using hnsw
CREATE INDEX ON memory USING hnsw (embedding vector_ip_ops);

-- Create an index for user_id to allow efficient lookups by user
CREATE INDEX idx_user_id ON memory(user_id);
