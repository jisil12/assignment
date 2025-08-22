-- Create database
CREATE DATABASE rating_system;

-- Use the database
\c rating_system;

-- Create a default system administrator
-- Password: Admin123! (hashed)
INSERT INTO users (name, email, password, address, role, "createdAt", "updatedAt")
VALUES (
  'System Administrator Account',
  'admin@rating-system.com',
  '$2a$10$x7rP4OZc5hN8K9mJ2wL3CeuR6XvFt8yQ9nH4sL2pB1vE7uA6mT8gW',
  '123 Admin Street, Admin City, Admin State',
  'system_admin',
  NOW(),
  NOW()
);

-- Create some sample stores for testing
INSERT INTO stores (name, email, password, address, "averageRating", "createdAt", "updatedAt")
VALUES 
(
  'Sample Electronics Store 01',
  'electronics@sample-store.com',
  '$2a$10$x7rP4OZc5hN8K9mJ2wL3CeuR6XvFt8yQ9nH4sL2pB1vE7uA6mT8gW',
  '456 Electronics Ave, Tech City, TC 12345',
  0,
  NOW(),
  NOW()
),
(
  'Sample Clothing Store 02',
  'clothing@sample-store.com',
  '$2a$10$x7rP4OZc5hN8K9mJ2wL3CeuR6XvFt8yQ9nH4sL2pB1vE7uA6mT8gW',
  '789 Fashion Street, Style City, SC 67890',
  0,
  NOW(),
  NOW()
);

-- Create a sample normal user for testing
INSERT INTO users (name, email, password, address, role, "createdAt", "updatedAt")
VALUES (
  'Sample Normal User Account',
  'user@rating-system.com',
  '$2a$10$x7rP4OZc5hN8K9mJ2wL3CeuR6XvFt8yQ9nH4sL2pB1vE7uA6mT8gW',
  '321 User Lane, User City, UC 54321',
  'normal_user',
  NOW(),
  NOW()
);