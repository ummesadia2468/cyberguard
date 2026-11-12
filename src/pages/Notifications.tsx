import { useApp } from '../context/AppContext'
import { Head } from '../components/Table'
export default function Notifications(){
 const {notifs,setNotifs}=useApp()
 return <><Head t="Notifications" s="New incidents appear here as they are detected."/>
 <div className="flex gap-3 mb-6"><button className="border rounded-md px-3 py-2 text-sm" onClick={()=>setNotifs(n=>n.map(x=>({...x,read:true})))}>Mark all read</button><button className="border rounded-md px-3 py-2 text-sm" onClick={()=>setNotifs(()=>[])}>Clear all</button></div>
 <ul className="nc divide-y max-w-2xl">{notifs.map(n=><li key={n.id} className="p-4 flex justify-between gap-4 text-sm"><span className="flex items-center gap-3">{!n.read&&<i className="w-2 h-2 rounded-full bg-[#D65CEB] shadow-[0_0_8px_#D65CEB]"/>}{n.msg}</span><span className="font-mono text-xs text-muted">{new Date(n.t).toLocaleTimeString()}</span></li>)}
 {!notifs.length&&<li className="p-8 text-center text-muted">No notifications yet. Run a simulation to create one.</li>}</ul></>}
