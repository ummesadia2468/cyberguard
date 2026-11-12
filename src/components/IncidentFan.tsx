import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { SecurityEvent } from '../types/security'
const tone={Blocked:'#EF4444',Flagged:'#F59E0B',Allowed:'#10B981'}
export default function IncidentFan({events}:{events:SecurityEvent[]}){
 const [i,setI]=useState(0);const n=events.length;if(!n) return null
 return <div className="relative h-80 flex items-center justify-center">
  {events.map((e,k)=>{const d=k-i;if(Math.abs(d)>3)return null
   return <motion.article key={e.id} onClick={()=>setI(k)} animate={{x:d*130,rotate:d*7,y:Math.abs(d)*14,scale:d===0?1.08:.9,zIndex:10-Math.abs(d)}} transition={{type:'spring',stiffness:140,damping:20}} className="absolute w-52 h-64 bg-surface border rounded-[6px] p-4 cursor-pointer flex flex-col justify-between" style={d===0?{boxShadow:'0 0 20px rgba(214,92,235,.3)',borderColor:'#A644D6'}:{}}>
    <div className="h-24 rounded-[3px]" style={{background:`linear-gradient(160deg,#2A0F45,${tone[e.status]}55)`}}/>
    <div><div className="font-mono text-[10px] text-muted">{e.id}</div><div className="font-serif text-xl leading-tight">{e.type}</div><div className="font-mono text-[11px] text-muted truncate">{e.resource}</div></div>
    <div className="flex justify-between text-xs"><span style={{color:tone[e.status]}}>{e.status}</span><span className="font-mono text-accent">risk {e.risk}</span></div></motion.article>})}
  <div className="absolute bottom-0 flex gap-3"><button aria-label="Previous" onClick={()=>setI(Math.max(0,i-1))} className="border p-1.5 rounded-full"><ChevronLeft size={16} strokeWidth={1.5}/></button><button aria-label="Next" onClick={()=>setI(Math.min(n-1,i+1))} className="border p-1.5 rounded-full"><ChevronRight size={16} strokeWidth={1.5}/></button></div></div>}
