create schema private;

create extension if not exists pg_net with schema extensions;
create extension if not exists vector with schema extensions;

create table memory(
    user_id integer primary key,
    memory_id uuid not null,
    content text not null,
    embedding vector(384)
    );

create index on memory using hnsw  (embedding vector_ip_ops);

create function private.embedding_trigger()
returns trigger
language plpgsql
as $$
declare 
    result int;
begin
    select
        net.http_post(
            url :=  'http://localhost:8787/memory/embed', 
            headers := jsonb_build_object('Content-Type', 'application/json'),
            body := jsonb_build_object('memory_id', new.memory_id)
        )
    into result;
    return new;
end;
$$;

create trigger memory_embedding_trigger
    after insert on memory
    for each row
    execute function private.embedding_trigger();   