import { useEffect, useState } from 'react'
import * as api from '../services/api'
import { Head } from '../components/Table'
export default function Agents(){
 const [r,setR]=useState({mode:'DEMO TELEMETRY' as api.Mode,ms:0,health:'standby'})
 useEffect(()=>{const go=async()=>{const t=performance.now();const [a,h]=await Promise.all([api.getRoot(),api.getHealth()]);setR({mode:a.mode,ms:Math.round(performance.now()-t),health:String((h.data as {status?:string}).status??'ok')})};go();const i=setInterval(go,5000);return()=>clearInterval(i)},[])
 const live=r.mode==='LIVE FASTAPI'
 return <><Head t="API infrastructure and agents" s="Polls GET / and GET /health every 5 seconds."/>
 <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[['Connection',live?'Verified Live (FastAPI)':'Standby Demo Mode'],['Latency',`${r.ms} ms`],['Health',r.health]].map(([k,v])=><div key={k} className="nc min-w-0 p-4 sm:p-6"><div className="text-sm text-muted">{k}</div><div className={`mt-2 break-words font-serif text-2xl sm:text-3xl ${live?'text-emerald-400':'text-accent'}`}>{v}</div></div>)}</div>
 <h2 className="mb-4 mt-10 font-serif text-2xl sm:mt-12 sm:text-3xl">Agents</h2><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[['Scanner','Inspects each incoming request.'],['Analyzer','Scores risk from 0 to 100.'],['Defender','Allows, flags or blocks.']].map(([n,d])=><div key={n} className="nc p-4 sm:p-6"><div className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/>{n} agent</div><p className="mt-2 text-sm text-muted">{d}</p><div className="mt-3 font-mono text-xs text-accent">{live?'Verified live':'Standby demo'}</div></div>)}</div>
 <h2 className="mb-4 mt-10 font-serif text-2xl sm:mt-12 sm:text-3xl">Supported endpoints</h2><ul className="nc divide-y font-mono text-xs">{['GET /','GET /health','GET /stats','GET /events','GET /api/accounts/{account_id}','POST /simulate/bola','POST /simulate/brute-force'].map(e=><li key={e} className="break-all p-3 sm:break-normal">{e}</li>)}</ul></>}
