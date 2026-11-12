import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Head } from '../components/Table'
const P=['Enforce object ownership checks','Rate limit login attempts','Lock accounts after 5 failures','Block known malicious IPs','Require step-up for risk above 50','Log every blocked request']
export default function Policies(){
 const {log}=useApp();const [on,setOn]=useState<Record<string,boolean>>(()=>{try{return JSON.parse(localStorage.getItem('cg_pol')||'')}catch{return Object.fromEntries(P.map(p=>[p,true]))}})
 const t=(p:string)=>{const n={...on,[p]:!on[p]};setOn(n);localStorage.setItem('cg_pol',JSON.stringify(n));log(`${n[p]?'Enabled':'Disabled'} policy: ${p}`)}
 return <><Head t="Security policies" s="Toggle the protections this workspace applies."/><ul className="nc divide-y max-w-2xl">{P.map(p=><li key={p} className="p-4 flex justify-between items-center text-sm">{p}<button role="switch" aria-checked={!!on[p]} aria-label={p} onClick={()=>t(p)} className={`w-11 h-6 rounded-full relative transition ${on[p]?'bg-[#A644D6] shadow-[0_0_12px_#D65CEB]':'bg-[var(--bg-elev)]'}`}><i className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${on[p]?'left-[22px]':'left-0.5'}`}/></button></li>)}</ul></>}
