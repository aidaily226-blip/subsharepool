'use client'
import { useState } from 'react'

interface FilterBarProps {
  tags: { value: string; label: string }[]
  onChange?: (value: string) => void
}

export default function FilterBar({ tags, onChange }: FilterBarProps) {
  const [active, setActive] = useState(tags[0]?.value)

  const handle = (value: string) => {
    setActive(value)
    onChange?.(value)
  }

  return (
    <div className="flex gap-2 flex-wrap mb-4 overflow-x-auto pb-1">
      {tags.map(tag => (
        <button
          key={tag.value}
          onClick={() => handle(tag.value)}
          className={`filter-tag ${active === tag.value ? 'filter-tag-active' : ''}`}
        >
          {tag.label}
        </button>
      ))}
    </div>
  )
}
