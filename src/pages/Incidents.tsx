import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Table, { Head, Risk } from '../components/Table'
import Drawer from '../components/Drawer'
import type { SecurityEvent } from '../types/security'
export default function Incidents(){
 const {events}=useApp();const [sp]=useSearchParams();const [st,setSt]=useState('All');const [sel,setSel]=useState<SecurityEvent|null>(null)
 const rows=events.filter(e=>st==='All'||e.status===st)
 return <><Head t="Incident archive" s="Every recorded security event with its explanation and recommended fix."/>
 <Table rows={rows} init={sp.get('q')||''} onRow={setSel} extra={<select aria-label="Status" value={st} onChange={e=>setSt(e.target.value)}>{['All','Allowed','Blocked','Flagged'].map(s=><option key={s}>{s}</option>)}</select>}
 cols={[{h:'Incident',f:e=>e.id,mono:true},{h:'Event type',f:e=>e.type},{h:'User',f:e=>e.user,mono:true},{h:'Resource',f:e=>e.resource,mono:true},{h:'Risk',f:e=><Risk n={e.risk}/>},{h:'Status',f:e=>e.status},{h:'Time',f:e=>new Date(e.timestamp).toLocaleTimeString(),mono:true},{h:'Explanation',f:e=>e.reason},{h:'Recommendation',f:e=>e.recommendation}]}/>
 <Drawer e={sel} close={()=>setSel(null)}/></>}
