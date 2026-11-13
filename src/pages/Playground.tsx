import { useState } from 'react'
import axios from 'axios'
import { apiBase } from '../services/api'
import { useApp } from '../context/AppContext'
import { Head } from '../components/Table'
const E=[['GET','/'],['GET','/health'],['GET','/stats'],['GET','/events'],['GET','/api/accounts/1001'],['POST','/simulate/bola'],['POST','/simulate/brute-force']]
export default function Playground(){
 const {log}=useApp();const [i,setI]=useState(0);const [out,setOut]=useState('Pick an endpoint and send a request.');const [busy,setBusy]=useState(false)
 const send=async()=>{setBusy(true);const [m,p]=E[i];const t=performance.now();log(`Playground ${m} ${p}`)
  try{const r=await axios.request({method:m,url:apiBase()+p,timeout:3000});setOut(`${r.status}  ${Math.round(performance.now()-t)} ms\n\n${JSON.stringify(r.data,null,2)}`)}catch(e){setOut(`Request failed: ${(e as Error).message}\n\nStart FastAPI on ${apiBase()} and allow CORS, then try again.`)}setBusy(false)}
 return <><Head t="API playground" s={`Sends real requests to ${apiBase()}.`}/><div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap"><select aria-label="Endpoint" value={i} onChange={e=>setI(+e.target.value)} className="w-full max-w-full sm:w-auto">{E.map((e,k)=><option key={k} value={k}>{e[0]} {e[1]}</option>)}</select><button disabled={busy} onClick={send} className="w-full rounded-md bg-accent px-5 py-2 font-semibold sm:w-auto">{busy?'Sending…':'Send request'}</button></div>
 <pre className="nc p-4 mt-6 font-mono text-xs text-sky-300 overflow-x-auto min-h-[220px] whitespace-pre-wrap">{out}</pre></>}
