/*
  # Create deals table with multi-tenancy

  1. New Tables
    - `deals`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references organizations)
      - `title` (text)
      - `value` (numeric)
      - `stage` (text)
      - `probability` (integer)
      - `expected_close_date` (date)
      - `contact_id` (uuid, references contacts)
      - `company_id` (uuid, references companies)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `deals` table
    - Add policies for organization-based access
*/

CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  value numeric(12,2) NOT NULL DEFAULT 0,
  stage text NOT NULL DEFAULT 'prospecting' CHECK (stage IN ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost')),
  probability integer NOT NULL DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date date,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Users can only access deals from their organization
CREATE POLICY "Users can access organization deals"
  ON deals
  FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE TRIGGER set_deals_organization_id
  BEFORE INSERT OR UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION set_organization_id();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();