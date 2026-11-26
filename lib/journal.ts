import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  destination?: string;
  cover?: string;
  coverLabel?: string;
}

const DIR = path.join(process.cwd(), "content", "journal");

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { data } = matter(fs.readFileSync(path.join(DIR, f), "utf8"));
      return { slug: f.replace(/\.mdx$/, ""), ...(data as Omit<PostMeta, "slug">), date: String(data.date) };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): { meta: PostMeta; content: string } | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { meta: { slug, ...(data as Omit<PostMeta, "slug">), date: String(data.date) }, content };
}
