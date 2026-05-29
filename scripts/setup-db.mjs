// Run: node scripts/setup-db.mjs
// Run: SUPABASE_PROJECT=xxx SUPABASE_TOKEN=sbp_xxx node scripts/setup-db.mjs
const PROJECT = process.env.SUPABASE_PROJECT;
const TOKEN   = process.env.SUPABASE_TOKEN;
if (!PROJECT || !TOKEN) { console.error("Set SUPABASE_PROJECT and SUPABASE_TOKEN env vars"); process.exit(1); }
const URL     = `https://api.supabase.com/v1/projects/${PROJECT}/database/query`;

async function sql(query) {
  const res = await fetch(URL, {
    method:  "POST",
    headers: { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body:    JSON.stringify({ query }),
  });
  const json = await res.json();
  if (json.message) throw new Error(json.message);
  return json;
}

async function run() {
  const steps = [
    // ── Tables ───────────────────────────────────────
    {
      name: "menu_items",
      q: `CREATE TABLE IF NOT EXISTS menu_items (
        id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
        category    TEXT    NOT NULL,
        name        TEXT    NOT NULL,
        meitei      TEXT    DEFAULT '',
        description TEXT    NOT NULL DEFAULT '',
        price       INTEGER NOT NULL DEFAULT 0,
        tag         TEXT    DEFAULT '',
        available   BOOLEAN DEFAULT true,
        sort_order  INTEGER DEFAULT 0,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      )`,
    },
    {
      name: "gallery_images",
      q: `CREATE TABLE IF NOT EXISTS gallery_images (
        id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        storage_path TEXT NOT NULL DEFAULT '',
        url          TEXT NOT NULL,
        alt          TEXT NOT NULL DEFAULT '',
        sort_order   INTEGER DEFAULT 0,
        created_at   TIMESTAMPTZ DEFAULT NOW()
      )`,
    },
    {
      name: "opening_hours",
      q: `CREATE TABLE IF NOT EXISTS opening_hours (
        id        UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
        day       TEXT    NOT NULL,
        day_index INTEGER NOT NULL,
        is_open   BOOLEAN DEFAULT true,
        hours     TEXT    NOT NULL DEFAULT '',
        UNIQUE(day_index)
      )`,
    },
    {
      name: "restaurant_settings",
      q: `CREATE TABLE IF NOT EXISTS restaurant_settings (
        key        TEXT PRIMARY KEY,
        value      TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    },
    {
      name: "slideshow_images",
      q: `CREATE TABLE IF NOT EXISTS slideshow_images (
        id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
        storage_path TEXT    NOT NULL DEFAULT '',
        url          TEXT    NOT NULL,
        alt          TEXT    NOT NULL DEFAULT '',
        sort_order   INTEGER DEFAULT 0,
        active       BOOLEAN DEFAULT true,
        created_at   TIMESTAMPTZ DEFAULT NOW()
      )`,
    },

    // ── RLS ──────────────────────────────────────────
    { name: "RLS menu_items",          q: "ALTER TABLE menu_items          ENABLE ROW LEVEL SECURITY" },
    { name: "RLS gallery_images",      q: "ALTER TABLE gallery_images      ENABLE ROW LEVEL SECURITY" },
    { name: "RLS opening_hours",       q: "ALTER TABLE opening_hours       ENABLE ROW LEVEL SECURITY" },
    { name: "RLS restaurant_settings", q: "ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY" },
    { name: "RLS slideshow_images",    q: "ALTER TABLE slideshow_images    ENABLE ROW LEVEL SECURITY" },

    // ── Policies ─────────────────────────────────────
    { name: "policy menu read",      q: `DO $$ BEGIN CREATE POLICY "public_read_menu"      ON menu_items         FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$` },
    { name: "policy gallery read",   q: `DO $$ BEGIN CREATE POLICY "public_read_gallery"   ON gallery_images     FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$` },
    { name: "policy hours read",     q: `DO $$ BEGIN CREATE POLICY "public_read_hours"     ON opening_hours      FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$` },
    { name: "policy settings read",  q: `DO $$ BEGIN CREATE POLICY "public_read_settings"  ON restaurant_settings FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$` },
    { name: "policy slideshow read", q: `DO $$ BEGIN CREATE POLICY "public_read_slideshow" ON slideshow_images   FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$` },

    // ── Storage buckets ───────────────────────────────
    {
      name: "storage buckets",
      q: `INSERT INTO storage.buckets (id, name, public) VALUES ('gallery','gallery',true),('slideshow','slideshow',true) ON CONFLICT (id) DO NOTHING`,
    },
    {
      name: "storage read policy",
      q: `DO $$ BEGIN CREATE POLICY "public_read_storage" ON storage.objects FOR SELECT USING (bucket_id IN ('gallery','slideshow')); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    },
    {
      name: "storage insert policy",
      q: `DO $$ BEGIN CREATE POLICY "service_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('gallery','slideshow')); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    },
    {
      name: "storage delete policy",
      q: `DO $$ BEGIN CREATE POLICY "service_delete" ON storage.objects FOR DELETE USING (bucket_id IN ('gallery','slideshow')); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    },

    // ── Seed: Opening hours ───────────────────────────
    {
      name: "seed hours",
      q: `INSERT INTO opening_hours (day, day_index, is_open, hours) VALUES
        ('Monday',    0, false, 'Closed'),
        ('Tuesday',   1, true,  '12:00 PM – 3:00 PM, 6:30 PM – 10:00 PM'),
        ('Wednesday', 2, true,  '12:00 PM – 3:00 PM, 6:30 PM – 10:00 PM'),
        ('Thursday',  3, true,  '12:00 PM – 3:00 PM, 6:30 PM – 10:00 PM'),
        ('Friday',    4, true,  '12:00 PM – 3:00 PM, 6:30 PM – 10:30 PM'),
        ('Saturday',  5, true,  '11:00 AM – 3:30 PM, 6:30 PM – 10:30 PM'),
        ('Sunday',    6, true,  '11:00 AM – 3:30 PM, 6:00 PM – 9:30 PM')
        ON CONFLICT (day_index) DO NOTHING`,
    },

    // ── Seed: Restaurant settings ─────────────────────
    {
      name: "seed settings",
      q: `INSERT INTO restaurant_settings (key, value) VALUES
        ('name',        'Hentak.'),
        ('tagline',     'Nouvelle Manipuri Cuisine'),
        ('address',     'Imphal, Manipur, India'),
        ('phone',       '+91 98621 00000'),
        ('email',       'hello@hentakrestaurant.com'),
        ('instagram',   'https://www.instagram.com/hentak_restaurant'),
        ('facebook',    'https://facebook.com/hentakrestaurant'),
        ('description', 'A contemporary dining experience rooted in the ancient fermented food traditions of Manipur.')
        ON CONFLICT (key) DO NOTHING`,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const step of steps) {
    process.stdout.write(`  ${step.name}... `);
    try {
      await sql(step.q);
      console.log("✓");
      passed++;
    } catch (err) {
      console.log(`✗  ${err.message.split("\n")[0]}`);
      failed++;
    }
  }

  console.log(`\n${passed} passed · ${failed} failed`);
  if (failed === 0) console.log("✅ Database is ready!");
}

run().catch(console.error);
