CREATE SCHEMA "files_manager";
CREATE USER files_manager WITH PASSWORD 'password';

GRANT USAGE ON SCHEMA files_manager TO files_manager;
GRANT ALL PRIVILEGES ON SCHEMA files_manager TO files_manager;


CREATE SCHEMA "white_rabbit";
CREATE USER white_rabbit WITH PASSWORD 'password';

GRANT USAGE ON SCHEMA white_rabbit TO white_rabbit;
GRANT ALL PRIVILEGES ON SCHEMA white_rabbit TO white_rabbit;