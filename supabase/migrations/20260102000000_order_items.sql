-- ============================================================
-- ConfecOS - v2: Order Items & Print Enhancements
-- ============================================================

-- 1. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  order_id uuid REFERENCES production_orders(id) ON DELETE CASCADE,
  model text NOT NULL,
  custom_name text,
  size text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) DEFAULT 0,
  total_price numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 2. ADD COLUMNS TO PRODUCTION_ORDERS
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS unit_price numeric(10,2) DEFAULT 0;
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS total_price numeric(10,2) DEFAULT 0;
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS contact_person text;
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS phone text;

-- 3. HELPER FUNCTION (avoids RLS recursion)
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT company_id FROM profiles WHERE id = auth.uid()
$$;

-- 4. RLS POLICIES FOR ORDER_ITEMS
CREATE POLICY "Users can view items in their company"
  ON order_items FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert items in their company"
  ON order_items FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update items in their company"
  ON order_items FOR UPDATE
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete items in their company"
  ON order_items FOR DELETE
  USING (company_id = get_user_company_id());

-- 5. INDEXES
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 6. TRIGGER FOR AUTO COMPANY_ID
CREATE TRIGGER set_order_items_company_id
  BEFORE INSERT ON order_items
  FOR EACH ROW EXECUTE FUNCTION set_company_id();

-- 7. FIX EXISTING RLS POLICIES TO USE get_user_company_id()
-- (Run these to replace old subquery-based policies)

DROP POLICY IF EXISTS "Users can view profiles in their company" ON profiles;
CREATE POLICY "Users can view profiles in their company"
  ON profiles FOR SELECT
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can view clients in their company" ON clients;
CREATE POLICY "Users can view clients in their company"
  ON clients FOR SELECT
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can insert clients in their company" ON clients;
CREATE POLICY "Users can insert clients in their company"
  ON clients FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can update clients in their company" ON clients;
CREATE POLICY "Users can update clients in their company"
  ON clients FOR UPDATE
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can delete clients in their company" ON clients;
CREATE POLICY "Users can delete clients in their company"
  ON clients FOR DELETE
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can view products in their company" ON products;
CREATE POLICY "Users can view products in their company"
  ON products FOR SELECT
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can insert products in their company" ON products;
CREATE POLICY "Users can insert products in their company"
  ON products FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can update products in their company" ON products;
CREATE POLICY "Users can update products in their company"
  ON products FOR UPDATE
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can delete products in their company" ON products;
CREATE POLICY "Users can delete products in their company"
  ON products FOR DELETE
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can view stages in their company" ON production_stages;
CREATE POLICY "Users can view stages in their company"
  ON production_stages FOR SELECT
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can insert stages in their company" ON production_stages;
CREATE POLICY "Users can insert stages in their company"
  ON production_stages FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can update stages in their company" ON production_stages;
CREATE POLICY "Users can update stages in their company"
  ON production_stages FOR UPDATE
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can view orders in their company" ON production_orders;
CREATE POLICY "Users can view orders in their company"
  ON production_orders FOR SELECT
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can insert orders in their company" ON production_orders;
CREATE POLICY "Users can insert orders in their company"
  ON production_orders FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can update orders in their company" ON production_orders;
CREATE POLICY "Users can update orders in their company"
  ON production_orders FOR UPDATE
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can delete orders in their company" ON production_orders;
CREATE POLICY "Users can delete orders in their company"
  ON production_orders FOR DELETE
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can view order stages in their company" ON production_order_stages;
CREATE POLICY "Users can view order stages in their company"
  ON production_order_stages FOR SELECT
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can insert order stages in their company" ON production_order_stages;
CREATE POLICY "Users can insert order stages in their company"
  ON production_order_stages FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can update order stages in their company" ON production_order_stages;
CREATE POLICY "Users can update order stages in their company"
  ON production_order_stages FOR UPDATE
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can view history in their company" ON production_history;
CREATE POLICY "Users can view history in their company"
  ON production_history FOR SELECT
  USING (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can insert history in their company" ON production_history;
CREATE POLICY "Users can insert history in their company"
  ON production_history FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

DROP POLICY IF EXISTS "Users can view their own company" ON companies;
CREATE POLICY "Users can view their own company"
  ON companies FOR SELECT
  USING (id = get_user_company_id());
