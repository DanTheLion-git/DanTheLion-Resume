const WP_BASE =
  "https://public-api.wordpress.com/wp/v2/sites/thelionsalliance.wordpress.com";

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
}

export async function getPosts(limit = 10): Promise<WPPost[]> {
  const url = `${WP_BASE}/posts?per_page=${limit}&_fields=slug,title,excerpt,date,content,id`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error("Failed to fetch posts", res.status, await res.text());
    throw new Error("Failed to fetch posts from WordPress");
  }

  return res.json();
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const url = `${WP_BASE}/posts?slug=${slug}&_fields=slug,title,excerpt,date,content,id`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error("Failed to fetch post", res.status, await res.text());
    throw new Error("Failed to fetch post from WordPress");
  }

  const data: WPPost[] = await res.json();
  return data[0] ?? null;
}
