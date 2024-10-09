-- Create the 'releases_db' for managing application releases
CREATE DATABASE IF NOT EXISTS releases_db;
USE releases_db;

-- Create 'releases' table to track application versions in different accounts/regions
CREATE TABLE IF NOT EXISTS releases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,  
    version VARCHAR(50) NOT NULL,  
    account VARCHAR(255) NOT NULL,  
    region VARCHAR(100) NOT NULL,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);

-- Sample release data for testing
INSERT INTO releases (name, version, account, region) VALUES 
('application_one', '3.0.1', 'prod_five', 'primary'),
('application_two', '1.0.0', 'prod_one', 'primary'),
('application_three', '3.2.1', 'prod_one', 'secondary'),
('application_four', '4.4.4', 'prod_four', 'primary'),
('application_eight', '3.6.9', 'staging', 'primary');

-- Create a new user with limited privileges
DROP USER IF EXISTS 'app_user'@'%';
CREATE USER 'app_user'@'%' IDENTIFIED BY 'test123';  

-- Grant the user limited privileges (SELECT, INSERT, UPDATE) on the releases_db.releases table
GRANT SELECT, INSERT, UPDATE ON releases_db.releases TO 'app_user'@'%';

-- Disable remote root login
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');

FLUSH PRIVILEGES;
