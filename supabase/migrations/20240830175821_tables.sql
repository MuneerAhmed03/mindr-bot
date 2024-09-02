create schema if not exists private;
create extension if not exists pg_net with schema extensions;
create extension if not exists vector with schema extensions;

DROP TABLE IF EXISTS memory;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id integer PRIMARY KEY,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  photo_url TEXT,
  auth_date BIGINT, 
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT
);

CREATE INDEX idx_users_id ON users(id);


    CREATE TABLE memory (
    memory_id uuid PRIMARY KEY,
    user_id integer NOT NULL,
    content text NOT NULL,
    embedding vector(768),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
    
    CREATE INDEX ON memory USING hnsw (embedding vector_ip_ops); 
    CREATE INDEX idx_memory_user_id ON memory(user_id); 