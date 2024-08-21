CREATE OR REPLACE FUNCTION private.embedding_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    result INT;
BEGIN
    SELECT
        net.http_post(
            url := 'http://172.24.64.1:8787/memory/embed',
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