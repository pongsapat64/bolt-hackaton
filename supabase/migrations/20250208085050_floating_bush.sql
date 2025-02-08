/*
  # Update roles to admin and employee

  1. Changes
    - Update 'manager' role to 'admin'
    - Update role description

  2. Security
    - Maintains existing RLS policies
*/

-- Update the manager role to admin
UPDATE roles 
SET name = 'admin',
    description = 'Administrator with full system access'
WHERE name = 'manager';