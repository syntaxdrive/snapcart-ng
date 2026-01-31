-- 1. ADD COLUMNS
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS qualifications TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;

-- 2. CREATE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    target_id UUID, -- Can be seller_id or product_id
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS POLICIES FOR REVIEWS & REPORTS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can write reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins view reports" ON reports FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Authenticated users can report" ON reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. FUNCTION TO INCREMENT CLICKS (Securely)
CREATE OR REPLACE FUNCTION increment_product_clicks(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET clicks = clicks + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. AUTO VERIFY TRIGGER
CREATE OR REPLACE FUNCTION check_auto_verify()
RETURNS TRIGGER AS $$
DECLARE
    total_clicks INTEGER;
    current_seller_id UUID;
    is_already_verified BOOLEAN;
BEGIN
    SELECT seller_id INTO current_seller_id FROM products WHERE id = NEW.id;
    
    -- Calculate total clicks for this seller
    SELECT SUM(clicks) INTO total_clicks FROM products WHERE seller_id = current_seller_id;
    
    -- Check if already verified
    SELECT is_verified INTO is_already_verified FROM profiles WHERE id = current_seller_id;

    -- If total clicks > 500 and not verified, verify them!
    IF total_clicks >= 500 AND NOT is_already_verified THEN
        UPDATE profiles SET is_verified = TRUE WHERE id = current_seller_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_verify
AFTER UPDATE OF clicks ON products
FOR EACH ROW
EXECUTE FUNCTION check_auto_verify();
