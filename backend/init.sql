DO $ BEGIN    IF NOT EXISTS (        SELECT FROM pg_roles WHERE rolname = 'ordertracking'    ) THEN       CREATE ROLE ordertracking LOGIN ENCRYPTED PASSWORD 'OrderTrack2024';    END IF; END $;

GRANT ALL PRIVILEGES ON DATABASE order_tracking_db TO ordertracking;

\connect order_tracking_db

GRANT ALL ON SCHEMA public TO ordertracking;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ordertracking;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ordertracking;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ordertracking;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ordertracking;
