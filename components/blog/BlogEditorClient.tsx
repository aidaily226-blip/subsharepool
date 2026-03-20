'use client'
import { useState } from 'react'
import { slugify } from '@/lib/utils'

export default function BlogEditorClient() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)

  const slug = slugify(title)

  const handleSave = async () => {
    setSaving(true)
    // TODO: POST to /api/blog
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    alert('Post saved!')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">New Blog Post</h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={e => setPublished(e.target.checked)}
              className="rounded"
            />
            Publish
          </label>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save post'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="label">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="input text-lg font-medium"
            placeholder="Post title..."
          />
          {slug && <p className="text-xs text-gray-400 mt-1">Slug: /blog/{slug}</p>}
        </div>

        <div>
          <label className="label">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            className="textarea"
            rows={2}
            placeholder="Short description shown in listing..."
          />
        </div>

        <div>
          <label className="label">Content (Markdown supported)</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="textarea font-mono text-sm"
            rows={20}
            placeholder="Write your post in Markdown...&#10;&#10;## Heading&#10;&#10;Your content here..."
          />
        </div>
      </div>
    </div>
  )
}
