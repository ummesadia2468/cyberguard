import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { simulate } from '../services/api'
import { useApp } from '../context/AppContext'
import type { SimResult } from '../types/security'
const stages=['Request initiated','Threat analyzed','Defender response','Incident recorded']
const labs=[{kind:'bola' as const,title:'BOLA / IDOR exploit',desc:'A signed-in user requests an account object that belongs to someone else.',target:'GET /api/accounts/{account_id}'},{kind:'brute-force' as const,title:'Credential brute force',desc:'Rapid repeated login attempts against a single account.',target:'POST /auth/login'}]
function Lab({lab}:{lab:typeof labs[number]}){
 const {refresh,notify}=useApp();const [stage,setStage]=useState(-1);const [res,setRes]=useState<SimResult|null>(null);const [busy,setBusy]=useState(false)
 const run=async()=>{setBusy(true);setRes(null);setStage(0);const p=simulate(lab.kind)
  for(let i=1;i<4;i++){await new Promise(r=>setTimeout(r,650));setStage(i)}
  const {data}=await p;setRes(data);setBusy(false);await refresh();notify(`${data.attack} blocked. Incident recorded.`)}
 return <section className="min-w-0 space-y-5 border-t pt-6">
  <h2 className="break-words font-serif text-2xl sm:text-3xl">{lab.title}</h2><p className="max-w-md text-sm text-muted">{lab.desc}</p><div className="break-all font-mono text-xs sm:break-normal">{lab.target}</div>
  <button disabled={busy} onClick={run} className="btn font-semibold px-4 py-2 rounded-[3px] disabled:opacity-60">{busy?'Running…':'Run simulation'}</button>
  <ol className="space-y-2 text-sm">{stages.map((s,i)=><li key={s} className={`flex items-center gap-2 ${i<=stage?'':'text-muted'}`}>{i<stage||(i===stage&&!busy)?<Check size={14} strokeWidth={1.5} className="text-accent"/>:i===stage?<Loader2 size={14} strokeWidth={1.5} className="animate-spin"/>:<i className="w-3.5"/>}{s}</li>)}</ol>
  {res&&<div className="space-y-3 text-sm"><div>Risk score <span className="font-mono text-accent">{res.risk_score}</span></div><p>{res.explanation}</p><p><span className="text-muted">Defender action: </span>{res.defender_action}</p><p><span className="text-muted">Fix: </span>{res.remediation}</p><pre className="bg-elev border p-3 font-mono text-xs overflow-x-auto">{JSON.stringify(res.raw,null,2)}</pre></div>}</section>}
export default function Simulation(){return <div className="space-y-8 sm:space-y-10"><h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl">Simulation lab</h1><div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-12">{labs.map(l=><Lab key={l.kind} lab={l}/>)}</div></div>}
