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
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
            active === tag.value
              ? 'bg-brand text-white border-brand'
              : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          {tag.label}
        </button>
      ))}
    </div>
  )
}
