/* Table schema (run in Supabase SQL Editor):
CREATE TABLE IF NOT EXISTS kv_store_5cb5e93b (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
*/

import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const client = () =>
  createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

export const set = async (key: string, value: unknown): Promise<void> => {
  const supabase = client();
  const { error } = await supabase.from("kv_store_5cb5e93b").upsert({
    key,
    value,
  });
  if (error) throw new Error(error.message);
};

export const get = async (key: string): Promise<unknown> => {
  const supabase = client();
  const { data, error } = await supabase
    .from("kv_store_5cb5e93b")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.value;
};

export const del = async (key: string): Promise<void> => {
  const supabase = client();
  const { error } = await supabase
    .from("kv_store_5cb5e93b")
    .delete()
    .eq("key", key);
  if (error) throw new Error(error.message);
};

export const mset = async (
  keys: string[],
  values: unknown[]
): Promise<void> => {
  const supabase = client();
  const { error } = await supabase
    .from("kv_store_5cb5e93b")
    .upsert(keys.map((k, i) => ({ key: k, value: values[i] })));
  if (error) throw new Error(error.message);
};

export const mget = async (keys: string[]): Promise<unknown[]> => {
  const supabase = client();
  const { data, error } = await supabase
    .from("kv_store_5cb5e93b")
    .select("value")
    .in("key", keys);
  if (error) throw new Error(error.message);
  return data?.map((d) => d.value) ?? [];
};

export const mdel = async (keys: string[]): Promise<void> => {
  const supabase = client();
  const { error } = await supabase
    .from("kv_store_5cb5e93b")
    .delete()
    .in("key", keys);
  if (error) throw new Error(error.message);
};

export const getByPrefix = async (prefix: string): Promise<unknown[]> => {
  const supabase = client();
  const { data, error } = await supabase
    .from("kv_store_5cb5e93b")
    .select("key, value")
    .like("key", prefix + "%");
  if (error) throw new Error(error.message);
  return data?.map((d) => d.value) ?? [];
};
