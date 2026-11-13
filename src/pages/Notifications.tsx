import { useApp } from '../context/AppContext'
import { Head } from '../components/Table'
export default function Notifications(){
 const {notifs,setNotifs}=useApp()
 return <><Head t="Notifications" s="New incidents appear here as they are detected."/>
 <div className="mb-6 flex flex-wrap gap-3"><button className="rounded-md border px-3 py-2 text-sm" onClick={()=>setNotifs(n=>n.map(x=>({...x,read:true})))}>Mark all read</button><button className="rounded-md border px-3 py-2 text-sm" onClick={()=>setNotifs(()=>[])}>Clear all</button></div>
 <ul className="nc max-w-2xl divide-y">{notifs.map(n=><li key={n.id} className="flex items-start justify-between gap-3 p-4 text-sm"><span className="flex min-w-0 items-start gap-3 break-words">{!n.read&&<i className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#D65CEB] shadow-[0_0_8px_#D65CEB]"/>}{n.msg}</span><span className="shrink-0 font-mono text-xs text-muted">{new Date(n.t).toLocaleTimeString()}</span></li>)}
 {!notifs.length&&<li className="p-8 text-center text-muted">No notifications yet. Run a simulation to create one.</li>}</ul></>}
