import { Metadata } from 'next'
import BlogEditorClient from '@/components/blog/BlogEditorClient'

export const metadata: Metadata = { title: 'New Blog Post — Admin' }

export default function NewBlogPage() {
  return <BlogEditorClient />
}
