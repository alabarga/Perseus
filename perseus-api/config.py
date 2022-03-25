PORT = 5000
APP_PREFIX = '/perseus'
VERSION = 0.4


class LocalConfig:
    APP_LOGIC_DB_NAME = 'shared'
    APP_LOGIC_DB_USER = 'perseus'
    APP_LOGIC_DB_PASSWORD = 'password'
    APP_LOGIC_DB_HOST = 'localhost'
    APP_LOGIC_DB_PORT = 5432

    USER_SCHEMAS_DB_NAME = 'perseus'
    USER_SCHEMAS_DB_USER = 'perseus'
    USER_SCHEMAS_DB_PASSWORD = 'password'
    USER_SCHEMAS_DB_HOST = 'localhost'
    USER_SCHEMAS_DB_PORT = 5433


class DockerConfig:
    APP_LOGIC_DB_NAME = 'shared'
    APP_LOGIC_DB_USER = 'perseus'
    APP_LOGIC_DB_PASSWORD = 'password'
    APP_LOGIC_DB_HOST = 'shareddb'
    APP_LOGIC_DB_PORT = 5432

    USER_SCHEMAS_DB_NAME = 'perseus'
    USER_SCHEMAS_DB_USER = 'perseus'
    USER_SCHEMAS_DB_PASSWORD = 'password'
    USER_SCHEMAS_DB_HOST = 'perseusdb'
    USER_SCHEMAS_DB_PORT = 5432
