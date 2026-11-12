import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { MouseEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { RefreshCw, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { SecurityEvent } from '../types/security'

type ActivityRange='24h'|'7d'|'30d'
function buildActivitySeries(events:SecurityEvent[],range:ActivityRange){
 const bucketSize=range==='24h'?60*60*1000:24*60*60*1000
 const bucketCount=range==='24h'?24:range==='7d'?7:30
 const now=Date.now();const start=Math.floor(now/bucketSize)*bucketSize-(bucketCount-1)*bucketSize
 const buckets=Array.from({length:bucketCount},(_,i)=>{
  const date=new Date(start+i*bucketSize)
  return {t:range==='24h'?date.toLocaleTimeString([],{hour:'2-digit'}):date.toLocaleDateString([],{month:'short',day:'numeric'}),threats:0,blocked:0}
 })
 events.forEach(event=>{
  const timestamp=Date.parse(event.timestamp)
  if(!Number.isFinite(timestamp)||timestamp<start||timestamp>now||event.status==='Allowed')return
  const index=Math.floor((timestamp-start)/bucketSize)
  if(index<0||index>=buckets.length)return
  buckets[index].threats+=1
  if(event.status==='Blocked')buckets[index].blocked+=1
 })
 return buckets
}

function Counter({value}:{value:number}){
 const reducedMotion=useReducedMotion()
 const ref=useRef<HTMLSpanElement>(null);const previous=useRef(0)
 useEffect(()=>{const controls=animate(previous.current,value,{duration:reducedMotion?0:1.1,onUpdate:v=>{if(ref.current)ref.current.textContent=Math.round(v).toLocaleString()}});previous.current=value;return()=>controls.stop()},[value,reducedMotion])
 return <span ref={ref}>0</span>
}

function Tilt({children,className='',reducedMotion=false}:{children:ReactNode;className?:string;reducedMotion?:boolean}){
 const x=useMotionValue(0),y=useMotionValue(0)
 const rx=useSpring(useTransform(y,[-.5,.5],[10,-10]),{stiffness:200,damping:18})
 const ry=useSpring(useTransform(x,[-.5,.5],[-12,12]),{stiffness:200,damping:18})
 const move=(event:MouseEvent<HTMLDivElement>)=>{const bounds=event.currentTarget.getBoundingClientRect();x.set((event.clientX-bounds.left)/bounds.width-.5);y.set((event.clientY-bounds.top)/bounds.height-.5)}
 const variants=reducedMotion?{hidden:{opacity:1},visible:{opacity:1}}:{hidden:{opacity:0,y:24},visible:{opacity:1,y:0,transition:{duration:.55,ease:'easeOut'}}}
 return <motion.div variants={variants} whileHover={reducedMotion?undefined:{scale:1.015}} style={{rotateX:reducedMotion?0:rx,rotateY:reducedMotion?0:ry,transformPerspective:1100,transformStyle:'preserve-3d'}} onMouseMove={reducedMotion?undefined:move} onMouseLeave={reducedMotion?undefined:()=>{x.set(0);y.set(0)}} className={`nc p-6 ${className}`}>{children}</motion.div>
}

const tooltipStyle={background:'var(--bg-surface)',color:'var(--text-primary)',border:'1px solid var(--border-subtle)',borderRadius:6,fontFamily:'JetBrains Mono',fontSize:12}

function Hero3D({reducedMotion=false}:{reducedMotion?:boolean}){
 const mouseX=useMotionValue(0),mouseY=useMotionValue(0)
 const rotateY=useSpring(useTransform(mouseX,[-.5,.5],[-28,28]),{stiffness:60,damping:14})
 const rotateX=useSpring(useTransform(mouseY,[-.5,.5],[22,-22]),{stiffness:60,damping:14})
 return <div className="relative flex h-[340px] items-center justify-center" onMouseMove={reducedMotion?undefined:event=>{const bounds=event.currentTarget.getBoundingClientRect();mouseX.set((event.clientX-bounds.left)/bounds.width-.5);mouseY.set((event.clientY-bounds.top)/bounds.height-.5)}} onMouseLeave={reducedMotion?undefined:()=>{mouseX.set(0);mouseY.set(0)}}>
  <div className="scene"><motion.div className="stage" style={{rotateX:reducedMotion?0:rotateX,rotateY:reducedMotion?0:rotateY}}>
   {[[230,'ringA 9s linear infinite'],[300,'ringB 13s linear infinite'],[360,'ringA 20s linear infinite reverse']].map(([size,animation])=><div key={size as number} className="ring" style={{width:size as number,height:size as number,margin:`-${(size as number)/2}px 0 0 -${(size as number)/2}px`,animation:animation as string}}/>)}
   <div className="cube">{[1,2,3,4,5,6].map(face=><div key={face} className={`face f${face}`}><ShieldCheck size={44} strokeWidth={1.2}/></div>)}</div><div className="core"/>
  </motion.div></div>
  {Array.from({length:10}).map((_,index)=><i key={index} aria-hidden="true" className="absolute h-1.5 w-1.5 rounded-full bg-[#D65CEB] shadow-[0_0_10px_#D65CEB]" style={{left:`${8+index*9}%`,top:`${10+(index*37)%75}%`,animation:`floaty ${3+index%4}s ease-in-out ${index*.3}s infinite`}}/>)}
 </div>
}

export default function Dashboard(){
 const {stats,events,refresh,refreshing,refreshError,lastUpdated,mode}=useApp()
 const reducedMotion=useReducedMotion()
 const [range,setRange]=useState<ActivityRange>('24h')
 const hour=new Date().getHours()
 const greeting=hour<12?'Good morning':hour<18?'Good afternoon':'Good evening'
 const kpis=[['Total API requests',stats?.total_requests],['Safe requests',stats?.safe_requests],['Detected threats',stats?.threats_detected],['Blocked attacks',stats?.blocked_attacks]] as const
 const activity=useMemo(()=>buildActivitySeries(events,range),[events,range])
 const threats=events.filter(event=>event.status!=='Allowed')
 const distribution=Object.entries(threats.reduce<Record<string,number>>((counts,event)=>{counts[event.type]=(counts[event.type]||0)+1;return counts},{})).map(([name,count])=>({name,count}))
 const recentIncidents=threats.slice(0,5)
 const flagged=events.filter(event=>event.status==='Flagged').length
 const blocked=events.filter(event=>event.status==='Blocked').length
 const allowed=events.filter(event=>event.status==='Allowed').length
 const blockRate=stats?stats.threats_detected===0?0:Math.min(100,Math.round(100*stats.blocked_attacks/stats.threats_detected)):null
 const rangeLabel=range==='24h'?'last 24 hours':range==='7d'?'last 7 days':'last 30 days'
 const revealVariants=reducedMotion?{hidden:{opacity:1},visible:{opacity:1}}:{hidden:{opacity:0,y:20,rotateX:2},visible:{opacity:1,y:0,rotateX:0,transition:{duration:.6,ease:'easeOut'}}}
 const groupVariants={hidden:{},visible:{transition:{delayChildren:reducedMotion?0:.16,staggerChildren:reducedMotion?0:.12}}}
 const listVariants={hidden:{},visible:{transition:{staggerChildren:reducedMotion?0:.055}}}
 const itemVariants=reducedMotion?{hidden:{opacity:1},visible:{opacity:1}}:{hidden:{opacity:0,y:8},visible:{opacity:1,y:0,transition:{duration:.35,ease:'easeOut'}}}

 return <div className="space-y-8" style={{perspective:1400}}>
  <motion.section initial={reducedMotion?false:{opacity:0,scale:.985,y:12}} animate={{opacity:1,scale:1,y:0}} transition={{duration:reducedMotion?0:.55,ease:'easeOut'}} className="nc relative grid items-center overflow-hidden px-6 py-7 md:px-10 lg:grid-cols-[1.1fr_1fr]">
   <div aria-hidden="true" className="gridbg absolute inset-0"/><div aria-hidden="true" className="scanline"/>
   <div className="relative z-10">
    <div className="text-sm text-muted">{new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})}</div>
    <h1 className="mt-2 font-serif text-5xl leading-[1.02] md:text-7xl">{greeting},<br/>analyst.</h1>
    <svg aria-hidden="true" viewBox="0 0 260 14" className="mt-1 w-64" fill="none"><path d="M3 9 C40 2 70 14 110 7 S190 3 257 9" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"><animate attributeName="stroke-dasharray" from="0 300" to="300 0" dur="1.4s" fill="freeze"/></path></svg>
    <p className="mt-5 max-w-md text-muted">Your defenders have blocked <b className="text-ink">{stats?.blocked_attacks.toLocaleString()??'—'}</b> attacks. Flagged events are available for human review.</p>
    <div className="mt-6 flex flex-wrap items-center gap-3">
     <button onClick={()=>void refresh()} disabled={refreshing} aria-busy={refreshing} className="bg-accent flex items-center gap-2 rounded-xl px-5 py-3 font-semibold disabled:cursor-wait disabled:opacity-70"><RefreshCw size={15} strokeWidth={1.5} className={refreshing?'animate-spin':''}/>{refreshing?'Refreshing…':'Refresh data'}</button>
     <span className="text-xs text-muted" role="status">{lastUpdated?`Updated ${lastUpdated.toLocaleTimeString()}`:'Waiting for telemetry'}</span>
    </div>
    {refreshError&&<p role="alert" className="mt-3 text-sm text-red-300">{refreshError}</p>}
    {lastUpdated&&mode==='DEMO TELEMETRY'&&<p role="status" className="mt-3 max-w-md rounded-lg border border-amber-400/30 bg-amber-400/5 px-3 py-2 text-xs text-bronze">Demo telemetry is active. These values are sample data, not live backend data.</p>}
   </div>
   <div className="relative z-10">
    <Hero3D reducedMotion={!!reducedMotion}/>
    <div className="sticker absolute right-2 top-4 rounded-lg bg-[#F59E0B] px-4 py-2 text-sm font-bold text-[#1A1124] shadow-[0_6px_0_#7a4f06,0_0_30px_rgba(245,158,11,.4)]">{blockRate===null?'—':`${blockRate}%`} threats blocked</div>
   </div>
  </motion.section>

  <motion.div initial={reducedMotion?false:'hidden'} animate="visible" variants={groupVariants} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" style={{perspective:1200}}>
   {kpis.map(([label,value],index)=><Tilt key={label} reducedMotion={!!reducedMotion}><div className="text-sm text-muted">{label}</div><div className={`mt-3 font-serif ${index===0?'text-5xl':'text-4xl'} ${index===3?'text-accent':''}`}>{stats?<Counter value={value??0}/>:<span aria-label="Waiting for telemetry">—</span>}</div></Tilt>)}
  </motion.div>

  <motion.div initial={reducedMotion?false:'hidden'} animate="visible" variants={groupVariants} className="grid gap-6 lg:grid-cols-[3fr_2fr]">
   <motion.section variants={revealVariants} className="nc p-5 md:p-6">
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
     <div><h2 className="font-serif text-2xl">Threat activity</h2><p className="mt-1 text-xs text-muted">Detected and blocked events · {rangeLabel}</p></div>
     <label className="sr-only" htmlFor="activity-range">Threat activity time range</label>
     <select id="activity-range" aria-label="Threat activity time range" className="w-auto" value={range} onChange={event=>setRange(event.target.value as ActivityRange)}><option value="24h">24 hours</option><option value="7d">7 days</option><option value="30d">30 days</option></select>
    </div>
    {activity.some(point=>point.threats>0)?<div className="h-64"><ResponsiveContainer><AreaChart data={activity}><CartesianGrid stroke="var(--border-subtle)" vertical={false}/><XAxis dataKey="t" stroke="var(--text-muted)" fontSize={11}/><YAxis allowDecimals={false} stroke="var(--text-muted)" fontSize={11}/><Tooltip contentStyle={tooltipStyle}/><Area name="Detected" dataKey="threats" stroke="var(--bronze)" fill="var(--bronze)" fillOpacity={.12} strokeWidth={1.5} isAnimationActive={!reducedMotion} animationDuration={900} animationEasing="ease-out"/><Area name="Blocked" dataKey="blocked" stroke="var(--neon)" fill="var(--neon)" fillOpacity={.18} strokeWidth={1.5} isAnimationActive={!reducedMotion} animationDuration={900} animationEasing="ease-out"/></AreaChart></ResponsiveContainer></div>:<div className="flex h-64 items-center justify-center text-center text-sm text-muted">No detected threat activity in the {rangeLabel}.</div>}
   </motion.section>
   <motion.section variants={revealVariants} className="nc p-5 md:p-6">
    <h2 className="mb-4 font-serif text-2xl">Threat distribution</h2>
    {distribution.length?<div className="h-64"><ResponsiveContainer><BarChart data={distribution} layout="vertical"><XAxis type="number" allowDecimals={false} stroke="var(--text-muted)" fontSize={11}/><YAxis type="category" dataKey="name" width={110} stroke="var(--text-muted)" fontSize={11}/><Tooltip contentStyle={tooltipStyle}/><Bar name="Events" dataKey="count" fill="var(--neon)" barSize={10} isAnimationActive={!reducedMotion} animationDuration={900} animationEasing="ease-out"/></BarChart></ResponsiveContainer></div>:<div className="flex h-64 items-center justify-center text-center text-sm text-muted">No threat events to display.</div>}
   </motion.section>
  </motion.div>

  <motion.div initial={reducedMotion?false:'hidden'} animate="visible" variants={groupVariants} className="grid gap-6 lg:grid-cols-[3fr_2fr]">
   <motion.section variants={revealVariants} className="nc p-5 md:p-6">
    <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-serif text-2xl">Recent incidents</h2><Link to="/incidents" className="text-xs text-accent hover:underline">View all</Link></div>
    {recentIncidents.length?<motion.ul variants={listVariants} initial={reducedMotion?false:'hidden'} animate="visible" className="divide-y">{recentIncidents.map(event=><motion.li key={event.id} variants={itemVariants}><Link to={`/incidents?q=${encodeURIComponent(event.id)}`} className="flex items-center justify-between gap-4 py-3 text-sm hover:text-accent"><span className="min-w-0 truncate">{event.type}<span className="block truncate font-mono text-xs text-muted">{event.resource}</span></span><span className="shrink-0 font-mono text-accent">{event.risk}</span></Link></motion.li>)}</motion.ul>:<p className="py-8 text-center text-sm text-muted">No incidents to review.</p>}
   </motion.section>
   <motion.section variants={revealVariants} className="nc p-5 md:p-6">
    <h2 className="mb-4 font-serif text-2xl">Event outcomes</h2>
    <div className="font-serif text-6xl text-accent"><Counter value={flagged}/><span className="ml-2 text-base text-muted">flagged for review</span></div>
    <ul className="mt-6 space-y-3 text-sm">
     {[['Blocked',blocked,'text-bad'],['Flagged',flagged,'text-bronze'],['Allowed',allowed,'text-ok']].map(([label,count,color])=><li key={label as string} className="flex justify-between border-b pb-2"><span>{label}</span><span className={`font-mono ${color}`}>{count}</span></li>)}
    </ul>
   </motion.section>
  </motion.div>
 </div>
}
