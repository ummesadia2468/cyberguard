import { KeyboardEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { SecurityEvent } from '../types/security'

export default function GlobalSearch({ className = '' }: { className?: string }) {
 const { events } = useApp()
 const navigate = useNavigate()
 const [query, setQuery] = useState('')
 const [open, setOpen] = useState(false)
 const [activeIndex, setActiveIndex] = useState(0)
 const normalizedQuery = query.trim().toLowerCase()
 const matches = useMemo(() => {
  if (!normalizedQuery) return []
  return events.filter(event =>
   `${event.id} ${event.type} ${event.user} ${event.resource}`.toLowerCase().includes(normalizedQuery)
  ).slice(0, 6)
 }, [events, normalizedQuery])

 const selectEvent = (event: SecurityEvent) => {
  navigate(`/incidents?q=${encodeURIComponent(event.id)}`)
  setQuery('')
  setOpen(false)
  setActiveIndex(0)
 }

 const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'ArrowDown' && matches.length) {
   event.preventDefault()
   setOpen(true)
   setActiveIndex(index => Math.min(index + 1, matches.length - 1))
  } else if (event.key === 'ArrowUp' && matches.length) {
   event.preventDefault()
   setActiveIndex(index => Math.max(index - 1, 0))
  } else if (event.key === 'Enter' && matches.length) {
   event.preventDefault()
   selectEvent(matches[activeIndex] ?? matches[0])
  } else if (event.key === 'Escape') {
   setOpen(false)
  }
 }

 return <div className={`relative min-w-0 ${className}`}>
  <Search aria-hidden="true" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
  <input
   type="text"
   role="combobox"
   aria-label="Search incidents, users, and endpoints"
   aria-autocomplete="list"
   aria-expanded={open && matches.length > 0}
   aria-controls="global-search-results"
   aria-activedescendant={open && matches.length ? `global-search-result-${activeIndex}` : undefined}
   placeholder="Search events..."
   value={query}
   onChange={event => { setQuery(event.target.value); setActiveIndex(0); setOpen(true) }}
   onFocus={() => setOpen(true)}
   onBlur={() => setOpen(false)}
   onKeyDown={handleKeyDown}
   className="w-full pl-10 pr-10"
  />
  {query && <button type="button" aria-label="Clear search" onMouseDown={event => event.preventDefault()} onClick={() => { setQuery(''); setActiveIndex(0); setOpen(true) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
   <X aria-hidden="true" size={15}/>
  </button>}
  {open && normalizedQuery && <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border bg-surface p-1 shadow-[0_12px_36px_rgba(0,0,0,.28)]">
   {matches.length ? <ul id="global-search-results" role="listbox" aria-label="Matching security events">
   {matches.map((event, index) => <li key={event.id} role="presentation">
    <button id={`global-search-result-${index}`} role="option" aria-selected={index === activeIndex} type="button" onMouseDown={e => e.preventDefault()} onClick={() => selectEvent(event)} className={`w-full rounded-lg px-3 py-2 text-left ${index === activeIndex ? 'bg-elev' : 'hover:bg-elev'}`}>
      <span className="block truncate text-sm font-medium">{event.type} · {event.resource}</span>
      <span className="mt-1 block truncate font-mono text-[11px] text-muted">{event.id} · {event.user} · Risk {event.risk}</span>
     </button>
    </li>)}
   </ul> : <p role="status" className="px-3 py-3 text-sm text-muted">No matching security events.</p>}
  </div>}
 </div>
}
