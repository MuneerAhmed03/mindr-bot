drop trigger if exists memory_embedding_trigger on memory;
drop function if exists private.embedding_trigger;

create function workers_url()
returns text
language plpgsql
security definer
as $$
declare
  secret_value text;
begin
  select decrypted_secret into secret_value from vault.decrypted_secrets where name = 'supabase_url';
  return secret_value;
end;
$$;

CREATE OR REPLACE FUNCTION private.embedding_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    result INT;
BEGIN
    -- Log a message when the function is called
    RAISE NOTICE 'embedding_trigger function called for memory_id: %, content: %', new.memory_id, new.content;

    SELECT
        net.http_post(
            url := workers_url() || '/memory/embed',
            headers := jsonb_build_object('Content-Type', 'application/json'),
            body := jsonb_build_object(
                'id', new.memory_id,
                'text', new.content
            )
        )
    INTO result;

    -- Check the HTTP status code of the response
    IF result >= 200 AND result < 300 THEN
        -- Successful response (2xx status code)
        RETURN new;
    ELSE
        -- Error response
        RAISE NOTICE 'Error sending data to memory embedding service. Status code: %', result;
        RETURN null; -- Or handle the error in another way
    END IF;
END;
$$;

-- Create the updated trigger
create or replace trigger memory_embedding_trigger
    after insert on memory
    for each row
    execute function private.embedding_trigger();

create or replace function distance(
  embedding vector(768),
  id integer
)
returns float[]
language plpgsql
as $$
declare
  result float[];
begin
  select array_agg(m.embedding <#> distance.embedding order by m.embedding <#> distance.embedding)
  into result
  from memory m
  where m.user_id = distance.id;

  return result;
end;
$$;

create or replace function similarity_search(
  embedding vector(768),
  id integer,
  match_threshold float
)
returns text[]
language plpgsql
as $$
declare
  result text[];
begin
  select array_agg(m.content order by m.embedding <#> similarity_search.embedding)
  into result
  from memory m
  where m.user_id = similarity_search.id and m.embedding <#> similarity_search.embedding < -similarity_search.match_threshold;

  return result;
end;
$$;

CREATE OR REPLACE FUNCTION private.onboarding_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    result INT;
BEGIN

    SELECT
        net.http_post(
            url := workers_url() || '/start',
            headers := jsonb_build_object('Content-Type', 'application/json'),
            body := jsonb_build_object(
                'id', NEW.id
            )
        )
    INTO result;

    -- Check the HTTP status code of the response
    IF result >= 200 AND result < 300 THEN
        -- Successful response (2xx status code)
        RETURN new;
    ELSE
        -- Error response
        RAISE NOTICE 'Error sending data to memory embedding service. Status code: %', result;
        RETURN null; -- Or handle the error in another way
    END IF;
END;
$$;

create or replace trigger user_onboarding_trigger
    after insert on users
    for each row
    execute function private.onboarding_trigger();