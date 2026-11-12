import { useApp } from '../context/AppContext'
import Table, { Head, Risk } from '../components/Table'
export default function Users(){
 const {events}=useApp();const m=new Map<string,{user:string;n:number;blocked:number;max:number;last:string}>()
 events.forEach(e=>{const u=m.get(e.user)??{user:e.user,n:0,blocked:0,max:0,last:e.timestamp};u.n++;if(e.status==='Blocked')u.blocked++;u.max=Math.max(u.max,e.risk);if(e.timestamp>u.last)u.last=e.timestamp;m.set(e.user,u)})
 return <><Head t="Users and risk profiles" s="Each user's request history, grouped from recorded events."/><Table rows={[...m.values()].sort((a,b)=>b.max-a.max)} cols={[{h:'User ID',f:r=>r.user,mono:true},{h:'Requests',f:r=>r.n},{h:'Blocked',f:r=>r.blocked},{h:'Highest risk',f:r=><Risk n={r.max}/>},{h:'Last seen',f:r=>new Date(r.last).toLocaleTimeString(),mono:true}]}/></>}
