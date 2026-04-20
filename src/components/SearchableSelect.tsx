import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import type { Country } from '../data/visaRoutes'

type Props = {
  label: string
  options: Country[]
  value: string
  onChange: (code: string) => void
  placeholder?: string
}

export default function SearchableSelect({ label, options, value, onChange, placeholder = 'Select...' }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlightIdx, setHighlightIdx] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selected = options.find((o) => o.code === value)

  const filtered = options.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()))

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function openDropdown() {
    setOpen(true)
    setQuery('')
    setHighlightIdx(0)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function selectOption(code: string) {
    onChange(code)
    setOpen(false)
    setQuery('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[highlightIdx]) {
        selectOption(filtered[highlightIdx].code)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', minWidth: 0 }}>
      <label className="form-label">{label}</label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={openDropdown}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: `1.5px solid ${open ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--surface)',
          color: selected ? 'var(--text)' : 'var(--text-muted)',
          fontSize: '1rem',
          fontFamily: 'var(--font)',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: open ? '0 0 0 3px rgba(58,110,168,0.12)' : 'none',
          transition: 'border-color 0.15s',
        }}
      >
        {selected ? (
          <>
            <span style={{ fontSize: '1.3em', lineHeight: 1 }}>{selected.flag}</span>
            <span>{selected.name}</span>
          </>
        ) : (
          <span>{placeholder}</span>
        )}
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
            display: 'inline-block',
          }}
        >
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--surface)',
            border: '1.5px solid var(--accent)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 200,
            overflow: 'hidden',
          }}
        >
          {/* Search input */}
          <div style={{ padding: '8px' }}>
            <input
              ref={inputRef}
              type="text"
              className="form-input"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setHighlightIdx(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              aria-label={`Search ${label}`}
            />
          </div>

          {/* Options list */}
          <ul
            ref={listRef}
            role="listbox"
            aria-label={label}
            style={{ maxHeight: '200px', overflowY: 'auto', margin: 0, padding: '4px 0' }}
          >
            {filtered.length === 0 ? (
              <li style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No results
              </li>
            ) : (
              filtered.map((opt, idx) => (
                <li
                  key={opt.code}
                  role="option"
                  aria-selected={opt.code === value}
                  onClick={() => selectOption(opt.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    background:
                      idx === highlightIdx
                        ? 'var(--accent-light)'
                        : opt.code === value
                        ? '#f0f4fa'
                        : 'transparent',
                    fontWeight: opt.code === value ? 600 : 400,
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={() => setHighlightIdx(idx)}
                >
                  <span style={{ fontSize: '1.2em', lineHeight: 1 }}>{opt.flag}</span>
                  <span>{opt.name}</span>
                  {opt.code === value && (
                    <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '0.85rem' }}>✓</span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
