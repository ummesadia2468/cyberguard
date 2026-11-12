import { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useApp } from './context/AppContext'
import Layout from './components/Layout'
const Login=lazy(()=>import('./pages/Login'))
const Dashboard=lazy(()=>import('./pages/Dashboard'))
const Monitoring=lazy(()=>import('./pages/Monitoring'))
const Simulation=lazy(()=>import('./pages/Simulation'))
const Incidents=lazy(()=>import('./pages/Incidents'))
const Recommendations=lazy(()=>import('./pages/Recommendations'))
const Agents=lazy(()=>import('./pages/Agents'))
const Reports=lazy(()=>import('./pages/Reports'))
const Notifications=lazy(()=>import('./pages/Notifications'))
const Users=lazy(()=>import('./pages/Users'))
const Endpoints=lazy(()=>import('./pages/Endpoints'))
const Origins=lazy(()=>import('./pages/Origins'))
const Policies=lazy(()=>import('./pages/Policies'))
const Audit=lazy(()=>import('./pages/Audit'))
const Playground=lazy(()=>import('./pages/Playground'))
const Settings=lazy(()=>import('./pages/Settings'))
function Protected({children}:{children:JSX.Element}){const {authed}=useApp();return authed?children:<Navigate to="/login" replace/>}
export default function App(){
 const [showIntro,setShowIntro]=useState(true);const reduceMotion=useReducedMotion()
 useEffect(()=>{
  if(reduceMotion){setShowIntro(false);return}
  const timer=window.setTimeout(()=>setShowIntro(false),1450)
  return ()=>window.clearTimeout(timer)
 },[reduceMotion])
 return <><Suspense fallback={<div role="status" className="flex min-h-[40vh] items-center justify-center text-sm text-muted">Loading page…</div>}><Routes><Route path="/login" element={<Login/>}/>
<Route element={<Protected><Layout/></Protected>}><Route path="/" element={<Dashboard/>}/><Route path="/monitoring" element={<Monitoring/>}/><Route path="/incidents" element={<Incidents/>}/><Route path="/simulation-lab" element={<Simulation/>}/><Route path="/users" element={<Users/>}/><Route path="/endpoints" element={<Endpoints/>}/><Route path="/origins" element={<Origins/>}/><Route path="/recommendations" element={<Recommendations/>}/><Route path="/agents" element={<Agents/>}/><Route path="/policies" element={<Policies/>}/><Route path="/playground" element={<Playground/>}/><Route path="/reports" element={<Reports/>}/><Route path="/audit" element={<Audit/>}/><Route path="/notifications" element={<Notifications/>}/><Route path="/settings" element={<Settings/>}/></Route>
<Route path="*" element={<Navigate to="/" replace/>}/></Routes></Suspense>
 <AnimatePresence>
  {showIntro&&<motion.div
   key="startup-intro"
   role="status"
   aria-label="Loading CyberGuard AI"
   initial={{opacity:1}}
   animate={{opacity:1}}
   exit={{opacity:0}}
   transition={{duration:reduceMotion?0:.35}}
   className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg text-ink"
  >
   <motion.div
    initial={{scale:.72,opacity:0}}
    animate={{scale:1,opacity:1}}
    transition={{duration:reduceMotion?0:.55,ease:'easeOut'}}
    className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-[#D65CEB]/30 bg-surface shadow-[0_0_70px_rgba(214,92,235,.22)]"
   >
    <motion.div
     aria-hidden="true"
     animate={reduceMotion?undefined:{rotate:360}}
     transition={{duration:8,repeat:Infinity,ease:'linear'}}
     className="absolute inset-2 rounded-[22px] border border-dashed border-[#D65CEB]/35"
    />
    <svg aria-hidden="true" width="48" height="48" viewBox="0 0 40 40" fill="none">
     <motion.path
      d="M20 5l12 4.5v9c0 8-5.5 13-12 16.5-6.5-3.5-12-8.5-12-16.5v-9L20 5z"
      stroke="#D65CEB"
      strokeWidth="1.8"
      initial={{pathLength:0,opacity:.5}}
      animate={{pathLength:1,opacity:1}}
      transition={{duration:reduceMotion?0:.9,ease:'easeInOut'}}
     />
     <motion.circle
      cx="20" cy="20" r="3" fill="#F59E0B"
      initial={{scale:0,opacity:0}}
      animate={{scale:1,opacity:1}}
      transition={{delay:reduceMotion?0:.45,duration:reduceMotion?0:.3}}
     />
    </svg>
   </motion.div>
   <motion.div
    initial={{y:10,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{delay:reduceMotion?0:.2,duration:reduceMotion?0:.45}}
    className="mt-6 text-center"
   >
    <div className="font-serif text-3xl tracking-wide text-ink">CyberGuard <span className="text-[#D65CEB]">AI</span></div>
    <div className="mt-2 font-mono text-[10px] uppercase tracking-[.28em] text-muted">API defense, handled</div>
   </motion.div>
   <div aria-hidden="true" className="mt-8 h-px w-32 overflow-hidden bg-elev">
    <motion.div
     initial={{width:0}}
     animate={{width:'100%'}}
     transition={{duration:reduceMotion?0:1.15,ease:'easeInOut'}}
     className="h-full bg-[#D65CEB] shadow-[0_0_12px_#D65CEB]"
    />
   </div>
  </motion.div>}
 </AnimatePresence>
 </>}
