import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client — for reading data (browser + server)
export const supabase = createClient(url, anon);

// Admin client — bypasses RLS, server-side only!
export const supabaseAdmin = createClient(url, svc, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ── Types ──────────────────────────────────────────────
export interface MenuItem {
  id:          string;
  category:    string;
  name:        string;
  meitei?:     string;
  description: string;
  price:       number;
  tag?:        string;
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
  const { data } = await supabase
    .from("menu_items")
    .select("*")
    .eq("available", true)
    .order("sort_order");
  return data ?? [];
}

export async function getAllMenuItems(): Promise<MenuItem[]> {
  const { data } = await supabaseAdmin
    .from("menu_items")
    .select("*")
    .order("category")
    .order("sort_order");
  return data ?? [];
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getOpeningHours(): Promise<OpeningHour[]> {
  const { data } = await supabase
    .from("opening_hours")
    .select("*")
    .order("day_index");
  return data ?? [];
}

export async function getSlideshowImages(): Promise<SlideshowImage[]> {
  const { data } = await supabase
    .from("slideshow_images")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  return data ?? [];
}

export async function getSettings(): Promise<Settings> {
  const { data } = await supabase
    .from("restaurant_settings")
    .select("key, value");
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
}
