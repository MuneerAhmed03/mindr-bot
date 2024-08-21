-- Drop the existing trigger and function
drop trigger if exists memory_embedding_trigger on memory;
drop function if exists private.embedding_trigger;

-- Create the updated function
create function private.embedding_trigger()
returns trigger
language plpgsql
as $$
declare 
    result int;
begin
    select
        net.http_post(
            url := 'http://localhost:8787/memory/embed', 
            headers := jsonb_build_object('Content-Type', 'application/json'),
            body := jsonb_build_object(
                'id', new.memory_id,
                'text', new.content
            )
        )
    into result;
    return new;
end;
$$;

-- Create the updated trigger
create trigger memory_embedding_trigger
    after insert on memory
    for each row
    execute function private.embedding_trigger();