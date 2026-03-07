// 单文件版本：用于在 Supabase 网页「Edge Functions → Deploy via Editor」里粘贴
// 把整段代码复制到编辑器，函数名填：make-server-5cb5e93b

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

// ========== KV 存储（内联，无需单独文件）==========
const kvClient = () =>
  createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

const kv = {
  get: async (key: string): Promise<unknown> => {
    const supabase = kvClient();
    const { data, error } = await supabase
      .from("kv_store_5cb5e93b")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data?.value;
  },
  set: async (key: string, value: unknown): Promise<void> => {
    const supabase = kvClient();
    const { error } = await supabase.from("kv_store_5cb5e93b").upsert({
      key,
      value,
    });
    if (error) throw new Error(error.message);
  },
};

// ========== 主应用 ==========
const app = new Hono();
const BUCKET_NAME = "make-5cb5e93b-resources";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === BUCKET_NAME);
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 5242880,
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/gif",
        ],
      });
      console.log(`Bucket ${BUCKET_NAME} created`);
    }
  } catch (e) {
    console.error("Error checking/creating bucket:", e);
  }
})();

app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

const INITIAL_SITES = [
  {
    id: "1",
    title: "Minimal Design Gallery",
    url: "https://www.awwwards.com/",
    description:
      "A curated collection of minimalist web design inspiration focusing on clean layouts and typography.",
    imageUrl:
      "https://images.unsplash.com/photo-1583932692875-a42450d50acf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    category: "Inspiration",
    tags: ["Minimal", "Portfolio", "Clean"],
  },
  {
    id: "2",
    title: "Dark Mode UI Patterns",
    url: "https://dribbble.com/search/dark-mode",
    description:
      "Best practices and examples for designing dark mode interfaces for web and mobile applications.",
    imageUrl:
      "https://images.unsplash.com/photo-1702479744062-1880502275b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    category: "UI Design",
    tags: ["Dark Mode", "Dashboard", "Interface"],
  },
  {
    id: "3",
    title: "Typewolf",
    url: "https://www.typewolf.com/",
    description:
      "What's trending in type. A definitive guide to the best fonts used on the web today.",
    imageUrl:
      "https://images.unsplash.com/photo-1649000808933-1f4aac7cad9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    category: "Typography",
    tags: ["Fonts", "Layout", "Reference"],
  },
  {
    id: "4",
    title: "Colorful Dashboards",
    url: "https://www.behance.net/",
    description:
      "Exploration of vibrant color usage in data visualization and dashboard design.",
    imageUrl:
      "https://images.unsplash.com/photo-1568291652621-5c9754a9e70a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    category: "Dashboard",
    tags: ["Color", "Data Viz", "Admin"],
  },
];

app.get("/make-server-5cb5e93b/health", (c) =>
  c.json({ status: "ok" })
);

app.post("/make-server-5cb5e93b/upload", async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body["file"];
    if (!file || !(file instanceof File)) {
      return c.json({ error: "No file uploaded" }, 400);
    }
    if (!file.type.startsWith("image/")) {
      return c.json({ error: "Only images are allowed" }, 400);
    }
    const fileExt = file.name.split(".").pop() || "png";
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, { contentType: file.type, upsert: false });
    if (error) {
      console.error("Storage upload error:", error);
      return c.json({ error: "Failed to upload to storage" }, 500);
    }
    const { data: signedData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 3600);
    return c.json({ path: filePath, url: signedData?.signedUrl });
  } catch (e) {
    console.error("Upload handler error:", e);
    return c.json({ error: "Upload failed" }, 500);
  }
});

app.get("/make-server-5cb5e93b/sites", async (c) => {
  try {
    let sites = (await kv.get("design_sites")) as unknown[] | null;
    if (!sites) {
      sites = INITIAL_SITES;
      await kv.set("design_sites", sites);
    }
    if (Array.isArray(sites)) {
      const sitesWithUrls = await Promise.all(
        sites.map(async (site: Record<string, unknown>) => {
          if (site.storagePath) {
            const { data } = await supabase.storage
              .from(BUCKET_NAME)
              .createSignedUrl(String(site.storagePath), 3600);
            if (data?.signedUrl) {
              return { ...site, imageUrl: data.signedUrl };
            }
          }
          return site;
        })
      );
      return c.json(sitesWithUrls);
    }
    return c.json(sites);
  } catch (e) {
    console.error("Error fetching sites:", e);
    return c.json({ error: "Failed to fetch sites" }, 500);
  }
});

app.post("/make-server-5cb5e93b/sites", async (c) => {
  try {
    const newSiteData = (await c.req.json()) as Record<string, unknown>;
    if (!newSiteData?.title) {
      return c.json({ error: "Invalid site data" }, 400);
    }
    let sites = (await kv.get("design_sites")) as unknown[] | null;
    if (!sites || !Array.isArray(sites)) sites = INITIAL_SITES;
    const newSite = {
      ...newSiteData,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    const updatedSites = [newSite, ...sites];
    await kv.set("design_sites", updatedSites);
    if ((newSite as Record<string, unknown>).storagePath) {
      const { data } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(
          String((newSite as Record<string, unknown>).storagePath),
          3600
        );
      if (data?.signedUrl) {
        (newSite as Record<string, unknown>).imageUrl = data.signedUrl;
      }
    }
    return c.json(newSite);
  } catch (e) {
    console.error("Error adding site:", e);
    return c.json({ error: "Failed to add site" }, 500);
  }
});

app.put("/make-server-5cb5e93b/sites/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = (await c.req.json()) as Record<string, unknown>;
    let sites = ((await kv.get("design_sites")) as unknown[]) || [];
    if (!Array.isArray(sites)) sites = INITIAL_SITES;
    const index = sites.findIndex(
      (s: unknown) => (s as Record<string, unknown>).id === id
    );
    if (index === -1) {
      return c.json({ error: "Site not found" }, 404);
    }
    const oldSite = sites[index] as Record<string, unknown>;
    if (
      oldSite.storagePath &&
      updates.storagePath &&
      oldSite.storagePath !== updates.storagePath
    ) {
      try {
        await supabase.storage
          .from(BUCKET_NAME)
          .remove([String(oldSite.storagePath)]);
      } catch (e) {
        console.error("Error deleting old image:", e);
      }
    }
    const updatedSite = { ...oldSite, ...updates };
    sites[index] = updatedSite;
    await kv.set("design_sites", sites);
    if (updatedSite.storagePath) {
      const { data } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(String(updatedSite.storagePath), 3600);
      if (data?.signedUrl) updatedSite.imageUrl = data.signedUrl;
    }
    return c.json(updatedSite);
  } catch (e) {
    console.error("Error updating site:", e);
    return c.json({ error: "Failed to update site" }, 500);
  }
});

app.delete("/make-server-5cb5e93b/sites/:id", async (c) => {
  try {
    const id = c.req.param("id");
    let sites = ((await kv.get("design_sites")) as unknown[]) || [];
    if (!Array.isArray(sites)) sites = INITIAL_SITES;
    const siteToDelete = sites.find(
      (s: unknown) => (s as Record<string, unknown>).id === id
    );
    if (!siteToDelete) {
      return c.json({ error: "Site not found" }, 404);
    }
    const s = siteToDelete as Record<string, unknown>;
    if (s.storagePath) {
      try {
        await supabase.storage
          .from(BUCKET_NAME)
          .remove([String(s.storagePath)]);
      } catch (e) {
        console.error("Error deleting image file:", e);
      }
    }
    const newSites = sites.filter(
      (s: unknown) => (s as Record<string, unknown>).id !== id
    );
    await kv.set("design_sites", newSites);
    return c.json({ success: true });
  } catch (e) {
    console.error("Error deleting site:", e);
    return c.json({ error: "Failed to delete site" }, 500);
  }
});

Deno.serve(app.fetch);
