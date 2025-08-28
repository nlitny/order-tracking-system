DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_roles WHERE rolname = 'ordertracking'
    ) THEN
        CREATE ROLE ordertracking LOGIN ENCRYPTED PASSWORD 'OrderTrack2024';
    END IF;
END
$$;

CREATE DATABASE order_tracking_db OWNER ordertracking;

GRANT ALL PRIVILEGES ON DATABASE order_tracking_db TO ordertracking;
