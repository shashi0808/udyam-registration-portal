-- Initialize Udyam Registration Database

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aadhaar_number VARCHAR(12) UNIQUE NOT NULL,
    mobile_number VARCHAR(10),
    email VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    
    -- Personal Information
    aadhaar_number VARCHAR(12) NOT NULL,
    pan_number VARCHAR(10) NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    
    -- Contact Information
    mobile_number VARCHAR(10) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    pin_code VARCHAR(6) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    
    -- Registration Status
    status VARCHAR(50) DEFAULT 'PENDING',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    
    -- Metadata
    created_by VARCHAR(50) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create OTP sessions table
CREATE TABLE IF NOT EXISTS otp_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aadhaar_number VARCHAR(12) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_aadhaar ON users(aadhaar_number);
CREATE INDEX IF NOT EXISTS idx_registrations_aadhaar ON registrations(aadhaar_number);
CREATE INDEX IF NOT EXISTS idx_registrations_pan ON registrations(pan_number);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_submitted ON registrations(submitted_at);
CREATE INDEX IF NOT EXISTS idx_otp_sessions_aadhaar ON otp_sessions(aadhaar_number);
CREATE INDEX IF NOT EXISTS idx_otp_sessions_expires ON otp_sessions(expires_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at 
    BEFORE UPDATE ON registrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
INSERT INTO users (aadhaar_number, mobile_number, email, is_verified) 
VALUES 
    ('123456789012', '9876543210', 'demo@example.com', TRUE)
ON CONFLICT (aadhaar_number) DO NOTHING;

-- Grant permissions to application user
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO udyam_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO udyam_user;