import { supabase } from "./supabaseClient";

export function postSummary(post) {
  const { id, slug, title, excerpt, created_at, category, tag, image_url } = post;
  return { id, slug, title, excerpt: excerpt || '', created_at, category: category || null, tag: tag || null, image_url: image_url || null, readingMinutes: Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200)) };
}

export async function getPublishedPosts() {
  // An explicit local snapshot allows design review during a content-service outage.
  // Production never silently replaces unavailable content with an empty blog.
  if (process.env.EDUPRADO_PREVIEW_POSTS_FILE) {
    const { readFile } = await import("node:fs/promises");
    const posts = JSON.parse(
      await readFile(process.env.EDUPRADO_PREVIEW_POSTS_FILE, "utf8"),
    );
    if (
      !Array.isArray(posts) ||
      !posts.length ||
      posts.some((post) => !post.slug || !post.title || !post.content)
    )
      throw new Error("Invalid article preview snapshot");
    return posts;
  }
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data?.length)
    throw new Error(
      "Article source unavailable or empty. Build stopped to preserve the published archive.",
    );
  return data;
}
