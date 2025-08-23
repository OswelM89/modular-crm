/*
  # Create contacts table with multi-tenancy

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references organizations)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `position` (text)
      - `company_id` (uuid, references companies)
      - `id_number` (text)
      - `tax_document` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `contacts` table
    - Add policies for organization-based access
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  position text,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  id_number text,
  tax_document text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Users can only access contacts from their organization
CREATE POLICY "Users can access organization contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Auto-set organization_id on insert
CREATE OR REPLACE FUNCTION set_organization_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.organization_id IS NULL THEN
    SELECT organization_id INTO NEW.organization_id
    FROM profiles
    WHERE id = auth.uid();
  END IF;
  
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_contacts_organization_id
  BEFORE INSERT OR UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION set_organization_id();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();