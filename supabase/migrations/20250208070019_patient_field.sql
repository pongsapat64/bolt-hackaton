/*
  # User Roles Setup

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique) - role name (manager, employee)
      - `description` (text) - role description
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `roles` table
    - Add policy for authenticated users to read roles
*/

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read roles
CREATE POLICY "Anyone can read roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default roles
INSERT INTO roles (name, description)
VALUES 
  ('manager', 'Full access to all system features'),
  ('employee', 'Limited access to POS and order management')
ON CONFLICT (name) DO NOTHING;