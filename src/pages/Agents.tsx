import { useEffect, useState } from 'react'
import * as api from '../services/api'
import { Head } from '../components/Table'
export default function Agents(){
 const [r,setR]=useState({mode:'DEMO TELEMETRY' as api.Mode,ms:0,health:'standby'})
 useEffect(()=>{const go=async()=>{const t=performance.now();const [a,h]=await Promise.all([api.getRoot(),api.getHealth()]);setR({mode:a.mode,ms:Math.round(performance.now()-t),health:String((h.data as {status?:string}).status??'ok')})};go();const i=setInterval(go,5000);return()=>clearInterval(i)},[])
 const live=r.mode==='LIVE FASTAPI'
 return <><Head t="API infrastructure and agents" s="Polls GET / and GET /health every 5 seconds."/>
 <div className="grid md:grid-cols-3 gap-6">{[['Connection',live?'Verified Live (FastAPI)':'Standby Demo Mode'],['Latency',`${r.ms} ms`],['Health',r.health]].map(([k,v])=><div key={k} className="nc p-6"><div className="text-sm text-muted">{k}</div><div className={`font-serif text-3xl mt-2 ${live?'text-emerald-400':'text-accent'}`}>{v}</div></div>)}</div>
 <h2 className="font-serif text-3xl mt-12 mb-4">Agents</h2><div className="grid md:grid-cols-3 gap-6">{[['Scanner','Inspects each incoming request.'],['Analyzer','Scores risk from 0 to 100.'],['Defender','Allows, flags or blocks.']].map(([n,d])=><div key={n} className="nc p-6"><div className="flex items-center gap-2"><i className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>{n} agent</div><p className="text-sm text-muted mt-2">{d}</p><div className="text-xs mt-3 font-mono text-accent">{live?'Verified live':'Standby demo'}</div></div>)}</div>
 <h2 className="font-serif text-3xl mt-12 mb-4">Supported endpoints</h2><ul className="nc divide-y font-mono text-xs">{['GET /','GET /health','GET /stats','GET /events','GET /api/accounts/{account_id}','POST /simulate/bola','POST /simulate/brute-force'].map(e=><li key={e} className="p-3">{e}</li>)}</ul></>}
