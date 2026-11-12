import { useApp } from '../context/AppContext'
import Table, { Head, Risk } from '../components/Table'
export default function Endpoints(){
 const {events}=useApp();const m=new Map<string,{r:string;n:number;blocked:number;max:number}>()
 events.forEach(e=>{const u=m.get(e.resource)??{r:e.resource,n:0,blocked:0,max:0};u.n++;if(e.status==='Blocked')u.blocked++;u.max=Math.max(u.max,e.risk);m.set(e.resource,u)})
 return <><Head t="Endpoint inventory" s="Every endpoint that received traffic, with its threat exposure."/><Table rows={[...m.values()].sort((a,b)=>b.max-a.max)} cols={[{h:'Endpoint',f:r=>r.r,mono:true},{h:'Hits',f:r=>r.n},{h:'Blocked',f:r=>r.blocked},{h:'Highest risk',f:r=><Risk n={r.max}/>}]}/></>}
