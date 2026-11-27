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
  /** Collection this post belongs to — a slug from content/pillars.ts. */
  pillar?: string;
  destination?: string;
  cover?: string;
  coverLabel?: string;
}

const DIR = path.join(process.cwd(), "content", "journal");

function read(file: string) {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
  const meta: PostMeta = { slug: file.replace(/\.mdx$/, ""), ...(data as Omit<PostMeta, "slug">), date: String(data.date) };
  return { meta, content };
}

export function getAllPosts(pillar?: string): PostMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => read(f).meta)
    .filter((p) => !pillar || p.pillar === pillar)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): { meta: PostMeta; content: string } | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  if (!fs.existsSync(path.join(DIR, `${slug}.mdx`))) return null;
  return read(`${slug}.mdx`);
}
