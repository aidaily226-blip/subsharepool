'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Props {
  onUpload: (url: string) => void
  currentImage?: string
  placeholder?: string
}

export default function ImageUpload({ onUpload, currentImage, placeholder = 'Upload image' }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(currentImage || '')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    // Check size before uploading
    if (file.size > 1024 * 1024) {
      setError('Image must be under 1MB. Please compress it first.')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Upload to Cloudinary
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Upload failed')
        setPreview('')
        return
      }

      onUpload(data.secure_url)
    } catch {
      setError('Upload failed. Please try again.')
      setPreview('')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="cursor-pointer group">
        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 group-hover:border-brand transition-colors flex items-center justify-center overflow-hidden bg-gray-50">
          {preview ? (
            <Image src={preview} alt="preview" width={96} height={96} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-2">
              <p className="text-2xl">📷</p>
              <p className="text-xs text-gray-400 mt-1">{placeholder}</p>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {uploading && (
        <p className="text-xs text-brand animate-pulse">Uploading...</p>
      )}

      {error && (
        <p className="text-xs text-red-500 text-center max-w-xs">{error}</p>
      )}

      <p className="text-xs text-gray-400">Max 1MB — JPG, PNG, WebP</p>
    </div>
  )
}