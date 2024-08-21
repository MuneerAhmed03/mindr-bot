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
            url := '',
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