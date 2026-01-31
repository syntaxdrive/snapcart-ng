-- Create table for tracking visits
CREATE TABLE IF NOT EXISTS analytics_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE analytics_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone (even anonymous) to log a visit
CREATE POLICY "Public can log visits" ON analytics_logs
    FOR INSERT WITH CHECK (true);

-- Allow Admins to see analytics
CREATE POLICY "Admins can view analytics" ON analytics_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Index for faster date queries
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_logs(created_at);
