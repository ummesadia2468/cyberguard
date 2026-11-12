import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Drawer from '../components/Drawer'
import type { SecurityEvent } from '../types/security'

const tabs=['All','Allowed','Blocked','Flagged'] as const
const statusClass={Allowed:'text-ok',Blocked:'text-bad',Flagged:'text-bronze'}

export default function Monitoring(){
 const {events}=useApp()
 const [tab,setTab]=useState<typeof tabs[number]>('All')
 const [query,setQuery]=useState('')
 const [selected,setSelected]=useState<SecurityEvent|null>(null)
 const rows=events.filter(event=>(tab==='All'||event.status===tab)&&JSON.stringify(event).toLowerCase().includes(query.toLowerCase()))

 return <div className="space-y-8">
  <h1 className="font-serif text-5xl">Threat monitoring</h1>
  <div className="flex flex-wrap justify-between gap-4">
   <div className="flex gap-1" role="group" aria-label="Filter requests by status">
    {tabs.map(status=><button key={status} aria-pressed={tab===status} onClick={()=>setTab(status)} className={`rounded-[3px] px-3 py-1.5 text-sm ${tab===status?'btn font-semibold':'text-muted'}`}>{status}</button>)}
   </div>
   <input aria-label="Search requests" placeholder="Search user, endpoint or incident" value={query} onChange={event=>setQuery(event.target.value)} className="w-72 border-b bg-transparent py-1 text-sm outline-none focus:border-accent"/>
  </div>
  <div className="overflow-x-auto border">
   <table className="w-full text-left text-sm">
    <thead className="bg-surface text-muted"><tr>{['Threat type','User ID','Resource','Risk','Detection reason','Status','Timestamp'].map(heading=><th key={heading} className="p-3 font-medium">{heading}</th>)}</tr></thead>
    <tbody>
     {rows.map(event=><tr key={event.id} tabIndex={0} onClick={()=>setSelected(event)} onKeyDown={keyEvent=>{if(keyEvent.key==='Enter'||keyEvent.key===' '){keyEvent.preventDefault();setSelected(event)}}} className="cursor-pointer border-t hover:bg-elev">
      <td className="p-3">{event.type}</td><td className="p-3 font-mono">{event.user}</td><td className="p-3 font-mono">{event.resource}</td><td className="p-3 font-mono">{event.risk}</td><td className="max-w-xs p-3">{event.reason}</td><td className={`p-3 ${statusClass[event.status]}`}>{event.status}</td><td className="p-3 font-mono text-xs">{new Date(event.timestamp).toLocaleString()}</td>
     </tr>)}
     {!rows.length&&<tr><td colSpan={7} className="p-8 text-center text-muted">No requests match. Clear the search or choose another status.</td></tr>}
    </tbody>
   </table>
  </div>
  <Drawer e={selected} close={()=>setSelected(null)}/>
 </div>
}
