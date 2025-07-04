-- Solvik SaaS Database Initialization
-- This script runs when PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create database user with proper permissions
-- (User is already created by Docker, this is just for reference)

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance (will be created by Prisma migrations)
-- This file can be extended with custom functions, triggers, etc.

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Solvik SaaS database initialized successfully';
END $$;