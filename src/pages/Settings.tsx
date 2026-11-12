import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Head } from '../components/Table'
export default function Settings(){
 const {log,notify}=useApp();const [url,setUrl]=useState(localStorage.getItem('cg_api')||'http://127.0.0.1:8000');const [demo,setDemo]=useState(localStorage.getItem('cg_demo')==='1');const [poll,setPoll]=useState(localStorage.getItem('cg_poll')||'8000')
 const save=()=>{localStorage.setItem('cg_api',url);localStorage.setItem('cg_demo',demo?'1':'0');localStorage.setItem('cg_poll',poll);log('Saved settings');notify('Settings saved. Reload to apply the new polling interval.')}
 return <><Head t="Settings" s="Stored in this browser only."/><div className="nc p-6 max-w-lg space-y-6">
 <label className="block text-sm text-muted">API base URL<input className="w-full mt-1" value={url} onChange={e=>setUrl(e.target.value)}/></label>
 <label className="block text-sm text-muted">Polling interval<select className="w-full mt-1" value={poll} onChange={e=>setPoll(e.target.value)}>{[['4000','4 seconds'],['8000','8 seconds'],['15000','15 seconds'],['30000','30 seconds']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
 <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={demo} onChange={e=>setDemo(e.target.checked)}/>Force demo telemetry</label>
 <button onClick={save} className="bg-accent px-5 py-2 rounded-md font-semibold">Save settings</button></div></>}
