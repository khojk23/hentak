import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy singletons — deferred until first use so Next.js build-time
// module evaluation doesn't throw before env vars are injected.
let _public: SupabaseClient | null = null;
let _admin:  SupabaseClient | null = null;

function publicClient(): SupabaseClient {
  if (!_public) {
    _public = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _public;
}

function adminClient(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return _admin;
}

// Proxy lets callers keep using `supabase.from(...)` syntax unchanged
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase      = new Proxy({} as SupabaseClient, { get: (_, p) => (publicClient() as unknown as Record<PropertyKey, unknown>)[p as string] });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin = new Proxy({} as SupabaseClient, { get: (_, p) => (adminClient()  as unknown as Record<PropertyKey, unknown>)[p as string] });

// ── Types ──────────────────────────────────────────────
export interface MenuItem {
  id:          string;
  category:    string;
  name:        string;
  meitei?:     string;
  description: string;
  price:       number;
  tag?:        string;
  image_url?:  string;
  available:   boolean;
  sort_order:  number;
  created_at:  string;
  updated_at:  string;
}

export interface GalleryImage {
  id:           string;
  storage_path: string;
  url:          string;
  alt:          string;
  sort_order:   number;
  created_at:   string;
}

export interface OpeningHour {
  id:        string;
  day:       string;
  day_index: number;
  is_open:   boolean;
  hours:     string;
}

export interface SlideshowImage {
  id:           string;
  storage_path: string;
  url:          string;
  alt:          string;
  sort_order:   number;
  active:       boolean;
  created_at:   string;
}

export type Settings = Record<string, string>;

// ── Helpers ────────────────────────────────────────────
export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const { data } = await supabase.from("menu_items").select("*").eq("available", true).order("sort_order");
    return data ?? [];
  } catch { return []; }
}

export async function getAllMenuItems(): Promise<MenuItem[]> {
  try {
    const { data } = await supabaseAdmin.from("menu_items").select("*").order("category").order("sort_order");
    return data ?? [];
  } catch { return []; }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const { data } = await supabase.from("gallery_images").select("*").order("sort_order");
    return data ?? [];
  } catch { return []; }
}

export async function getOpeningHours(): Promise<OpeningHour[]> {
  try {
    const { data } = await supabase.from("opening_hours").select("*").order("day_index");
    return data ?? [];
  } catch { return []; }
}

export async function getSlideshowImages(): Promise<SlideshowImage[]> {
  try {
    const { data } = await supabase.from("slideshow_images").select("*").eq("active", true).order("sort_order");
    return data ?? [];
  } catch { return []; }
}

export async function getSettings(): Promise<Settings> {
  try {
    const { data } = await supabase.from("restaurant_settings").select("key, value");
    return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  } catch { return {}; }
}
