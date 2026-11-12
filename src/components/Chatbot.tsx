import { useRef, useState } from 'react'
import { Bot, Send, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
const prompts=['Summarize active threats','Explain the latest BOLA attack','How do I fix high-risk incidents?']
export default function Chatbot(){
 const {events,stats}=useApp();const [open,setOpen]=useState(false);const [q,setQ]=useState('');const [m,setM]=useState<{u:boolean;t:string}[]>([{u:false,t:'I read your live events and stats. Ask me about threats, BOLA, brute force or fixes.'}]);const end=useRef<HTMLDivElement>(null)
 const reply=(x:string)=>{const s=x.toLowerCase();const e0=events[0]
  if(/bola|idor/.test(s)){const e=events.find(v=>v.type.includes('BOLA'));return e?`Latest BOLA: ${e.user} requested ${e.resource}. ${e.reason} Fix: ${e.recommendation}`:'No BOLA incidents yet. Run one in the Simulation lab.'}
  if(/brute|login/.test(s)){const e=events.find(v=>v.type.includes('Brute'));return e?`Latest brute force: ${e.reason} Fix: ${e.recommendation}`:'No brute-force incidents yet.'}
  if(/fix|remed|high/.test(s)){const h=events.filter(v=>v.risk>=80);return `${h.length} high-risk incidents. Top fixes: ${[...new Set(h.map(v=>v.recommendation))].slice(0,3).join(' ')}`}
  if(/report|pdf/.test(s))return 'Open Reports and choose Download PDF.'
  if(/summar|threat|active|status/.test(s))return `${stats?.threats_detected??0} threats detected and ${stats?.blocked_attacks??0} blocked. Latest: ${e0?`${e0.type} on ${e0.resource}, risk ${e0.risk}`:'none yet'}.`
  return 'Try: summarize active threats, explain the latest BOLA attack, or how to fix high-risk incidents.'}
 const send=(x:string)=>{if(!x.trim())return;setM(a=>[...a,{u:true,t:x},{u:false,t:reply(x)}]);setQ('');setTimeout(()=>end.current?.scrollIntoView(),50)}
 return <>{open&&<div className="fixed bottom-24 right-6 w-[min(380px,92vw)] h-[480px] nc flex flex-col z-40 shadow-[0_0_30px_rgba(166,68,214,.35)]"><div className="p-4 border-b flex justify-between"><span className="font-serif text-xl">Security co-pilot</span><button aria-label="Close" onClick={()=>setOpen(false)}><X size={16} strokeWidth={1.5}/></button></div>
  <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">{m.map((x,i)=><div key={i} className={`max-w-[85%] p-3 rounded-lg ${x.u?'ml-auto bg-accent':'bg-[var(--bg-elev)]'}`}>{x.t}</div>)}<div ref={end}/></div>
  <div className="p-3 border-t space-y-2"><div className="flex flex-wrap gap-2">{prompts.map(p=><button key={p} onClick={()=>send(p)} className="text-xs border rounded-full px-2 py-1 hover:border-[#D65CEB]">{p}</button>)}</div>
  <form onSubmit={e=>{e.preventDefault();send(q)}} className="flex gap-2"><input className="flex-1" aria-label="Message" value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about your threats"/><button className="bg-accent px-3 rounded-md" aria-label="Send"><Send size={16} strokeWidth={1.5}/></button></form></div></div>}
 <button onClick={()=>setOpen(o=>!o)} aria-label="Open co-pilot" className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent flex items-center justify-center z-40 animate-pulse shadow-[0_0_24px_rgba(214,92,235,.6)]"><Bot size={24} strokeWidth={1.5}/></button></>}
