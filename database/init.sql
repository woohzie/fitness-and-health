CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS chat_history;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS plan_enum;

CREATE TYPE plan_enum AS ENUM ('0', '1', '2', '3');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan plan_enum DEFAULT '0'
);

CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    chat TEXT NOT NULL,
    answer TEXT NOT NULL,
    time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password_hash, plan) VALUES
('john', 'john@mail.com', '123', '2')
ON CONFLICT (username) DO NOTHING;