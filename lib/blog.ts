import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  image: string
  readTime: string
  content: string
}

const postsDir = path.join(process.cwd(), 'content/blog')

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(postsDir)
  return files
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const slug = f.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(postsDir, f), 'utf-8')
      const { data } = matter(raw)
      return { slug, ...data } as BlogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string): BlogPost | null {
  try {
    const raw = fs.readFileSync(path.join(postsDir, `${slug}.mdx`), 'utf-8')
    const { data, content } = matter(raw)
    return { slug, content, ...data } as BlogPost
  } catch {
    return null
  }
}