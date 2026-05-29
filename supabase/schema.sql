-- =============================================
-- HENTAK RESTAURANT — Supabase Schema
-- Paste this entire file into:
-- Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  category     TEXT    NOT NULL,
  name         TEXT    NOT NULL,
  meitei       TEXT    DEFAULT '',
  description  TEXT    NOT NULL DEFAULT '',
  price        INTEGER NOT NULL DEFAULT 0,
  tag          TEXT    DEFAULT '',
  available    BOOLEAN DEFAULT true,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery_images (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path TEXT NOT NULL DEFAULT '',
  url          TEXT NOT NULL,
  alt          TEXT NOT NULL DEFAULT '',
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Opening hours (one row per day)
CREATE TABLE IF NOT EXISTS opening_hours (
  id        UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  day       TEXT    NOT NULL,
  day_index INTEGER NOT NULL,
  is_open   BOOLEAN DEFAULT true,
  hours     TEXT    NOT NULL DEFAULT '',
  UNIQUE(day_index)
);

-- Restaurant settings (key-value)
CREATE TABLE IF NOT EXISTS restaurant_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Slideshow / hero images
CREATE TABLE IF NOT EXISTS slideshow_images (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path TEXT    NOT NULL DEFAULT '',
  url          TEXT    NOT NULL,
  alt          TEXT    NOT NULL DEFAULT '',
  sort_order   INTEGER DEFAULT 0,
  active       BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ──────────────────────────────
ALTER TABLE menu_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images     ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_hours      ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE slideshow_images   ENABLE ROW LEVEL SECURITY;

-- Public can read everything
CREATE POLICY "public_read_menu"      ON menu_items         FOR SELECT USING (true);
CREATE POLICY "public_read_gallery"   ON gallery_images     FOR SELECT USING (true);
CREATE POLICY "public_read_hours"     ON opening_hours      FOR SELECT USING (true);
CREATE POLICY "public_read_settings"  ON restaurant_settings FOR SELECT USING (true);
CREATE POLICY "public_read_slideshow" ON slideshow_images   FOR SELECT USING (true);

-- ── Storage buckets ─────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES
  ('gallery',   'gallery',   true),
  ('slideshow', 'slideshow', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_gallery_storage"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('gallery', 'slideshow'));

CREATE POLICY "service_upload_gallery"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('gallery', 'slideshow'));

CREATE POLICY "service_delete_gallery"
  ON storage.objects FOR DELETE
  USING (bucket_id IN ('gallery', 'slideshow'));

-- ── Seed: Opening hours ─────────────────────────────
INSERT INTO opening_hours (day, day_index, is_open, hours) VALUES
  ('Monday',    0, false, 'Closed'),
  ('Tuesday',   1, true,  '12:00 PM – 3:00 PM, 6:30 PM – 10:00 PM'),
  ('Wednesday', 2, true,  '12:00 PM – 3:00 PM, 6:30 PM – 10:00 PM'),
  ('Thursday',  3, true,  '12:00 PM – 3:00 PM, 6:30 PM – 10:00 PM'),
  ('Friday',    4, true,  '12:00 PM – 3:00 PM, 6:30 PM – 10:30 PM'),
  ('Saturday',  5, true,  '11:00 AM – 3:30 PM, 6:30 PM – 10:30 PM'),
  ('Sunday',    6, true,  '11:00 AM – 3:30 PM, 6:00 PM – 9:30 PM')
ON CONFLICT (day_index) DO NOTHING;

-- ── Seed: Restaurant settings ───────────────────────
INSERT INTO restaurant_settings (key, value) VALUES
  ('name',       'Hentak.'),
  ('tagline',    'Nouvelle Manipuri Cuisine'),
  ('address',    'Imphal, Manipur, India'),
  ('phone',      '+91 98621 00000'),
  ('email',      'hello@hentakrestaurant.com'),
  ('instagram',  'https://www.instagram.com/hentak_restaurant'),
  ('facebook',   'https://facebook.com/hentakrestaurant'),
  ('description','A contemporary dining experience rooted in the ancient fermented food traditions of Manipur.')
ON CONFLICT (key) DO NOTHING;
