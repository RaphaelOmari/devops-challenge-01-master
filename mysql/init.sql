-- Create the 'top_secret_db' for managing user accounts
CREATE DATABASE IF NOT EXISTS top_secret_db;
USE top_secret_db;

-- Create 'users' table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (username, password) VALUES ('admin', 'admin');
INSERT INTO users (username, password) VALUES ('bart', 'cowabunga1');

-- Create the 'releases_db' for managing application releases
CREATE DATABASE IF NOT EXISTS releases_db;
USE releases_db;

-- Create 'releases' table to track application versions in different accounts/regions
CREATE TABLE IF NOT EXISTS releases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,                     -- Application name
    version VARCHAR(50) NOT NULL,                   -- Version of the application
    account VARCHAR(255) NOT NULL,                  -- Account where the app is deployed (e.g., prod_one, staging)
    region VARCHAR(100) NOT NULL,                   -- Region where the app is deployed (primary or secondary)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Time when the release was created
);

-- Insert sample release data for testing
INSERT INTO releases (name, version, account, region) VALUES 
('application_one', '3.0.1', 'prod_five', 'primary'),
('application_two', '1.0.0', 'prod_one', 'primary'),
('application_three', '3.2.1', 'prod_one', 'secondary'),
('application_four', '4.4.4', 'prod_four', 'primary'),
('application_eight', '3.6.9', 'staging', 'primary');

-- Create a new user with limited privileges
CREATE USER 'app_user'@'%' IDENTIFIED BY 'your_app_password';

-- Grant the user limited privileges (SELECT, INSERT, UPDATE) on the releases_db.releases table
GRANT SELECT, INSERT, UPDATE ON releases_db.releases TO 'app_user'@'%';

-- Apply the privileges
FLUSH PRIVILEGES;
