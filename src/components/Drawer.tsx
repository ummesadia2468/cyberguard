import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { SecurityEvent } from '../types/security'

export default function Drawer({e,close}:{e:SecurityEvent|null;close:()=>void}){
 const closeButton=useRef<HTMLButtonElement>(null)
 useEffect(()=>{
  if(!e)return
  const previousFocus=document.activeElement instanceof HTMLElement?document.activeElement:null
  const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();close()}}
  window.addEventListener('keydown',onKeyDown)
  closeButton.current?.focus()
  return()=>{window.removeEventListener('keydown',onKeyDown);previousFocus?.focus()}
 },[e])
 return <AnimatePresence>{e&&<>
  <motion.button type="button" aria-label="Close incident details" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={close} className="fixed inset-0 z-30 bg-black/60"/>
  <motion.aside initial={{x:480}} animate={{x:0}} exit={{x:480}} transition={{duration:.25}} className="fixed right-0 top-0 z-40 h-full w-full max-w-md overflow-y-auto border-l bg-surface p-5 shadow-[0_0_40px_rgba(166,68,214,.3)] sm:p-8" role="dialog" aria-modal="true" aria-labelledby="incident-detail-title">
   <button ref={closeButton} onClick={close} aria-label="Close incident details" className="absolute right-6 top-6"><X size={18} strokeWidth={1.5}/></button>
   <div className="font-mono text-xs text-muted">{e.id}</div><h2 id="incident-detail-title" className="mt-1 break-words font-serif text-3xl sm:text-4xl">{e.type}</h2>
   <dl className="mt-8 space-y-5 text-sm">{([['Risk score',String(e.risk)],['Defender decision',e.status],['Why it was flagged',e.reason],['Remediation',e.recommendation],['User / object',`${e.user} → ${e.resource}`],['Time',new Date(e.timestamp).toLocaleString()]] as const).map(([label,value])=><div key={label}><dt className="text-muted">{label}</dt><dd className="mt-1">{value}</dd></div>)}</dl>
  </motion.aside>
 </>}</AnimatePresence>
}
