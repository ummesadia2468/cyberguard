import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { Bell, FileText, FlaskConical, Globe, LayoutDashboard, LogOut, Menu, Network, ScrollText, Server, Settings, ShieldCheck, SlidersHorizontal, Terminal, Users, Activity, Archive, LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Chatbot from './Chatbot'
import GlobalSearch from './GlobalSearch'
import ThemeToggle from './ThemeToggle'
export const navItems:[string,string,LucideIcon][]=[['/','Dashboard',LayoutDashboard],['/monitoring','Threat monitoring',Activity],['/incidents','Incidents',Archive],['/simulation-lab','Simulation lab',FlaskConical],['/users','Users and risk',Users],['/endpoints','Endpoints',Network],['/origins','Attack origins',Globe],['/recommendations','Recommendations',ShieldCheck],['/agents','Agents',Server],['/policies','Policies',SlidersHorizontal],['/playground','API playground',Terminal],['/reports','Reports',FileText],['/audit','Audit log',ScrollText],['/notifications','Notifications',Bell],['/settings','Settings',Settings]]
const navGroups:[string,string[]][]=[
 ['Overview',['/']],
 ['Investigate',['/monitoring','/incidents','/simulation-lab']],
 ['Assets',['/users','/endpoints','/origins']],
 ['Protection',['/recommendations','/agents','/policies']],
 ['Operations',['/playground','/reports','/audit','/notifications']],
 ['Administration',['/settings']]
]
export default function Layout(){
 const {logout,toast,notifs,stats}=useApp();const [open,setOpen]=useState(false);const loc=useLocation();const unread=notifs.filter(n=>!n.read).length
 const ready=stats?Math.round(100*stats.blocked_attacks/Math.max(1,stats.threats_detected)):0
 return <div className="min-h-screen md:flex">
 {open&&<button type="button" aria-label="Close navigation menu" onClick={()=>setOpen(false)} className="fixed inset-x-0 bottom-0 top-14 z-40 bg-black/55 backdrop-blur-sm md:hidden"/>}
 <aside className={`${open?'flex':'hidden'} fixed inset-x-3 bottom-3 top-16 z-50 m-0 w-auto shrink-0 flex-col overflow-y-auto rounded-2xl bg-side p-5 text-side-text shadow-[0_0_50px_rgba(214,92,235,.18)] md:sticky md:inset-auto md:top-3 md:z-auto md:m-3 md:flex md:h-[calc(100vh-24px)] md:w-64`}>
  <div className="flex items-center gap-3 mb-7"><svg width="38" height="38" viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="#1A1124"/><path d="M20 8l11 4v8c0 7-5 11-11 14-6-3-11-7-11-14v-8z" fill="none" stroke="#D65CEB" strokeWidth="2"/><circle cx="20" cy="20" r="3" fill="#F59E0B"/></svg><div><div className="font-serif text-2xl leading-none">CyberGuard</div><div className="text-[11px] text-side-dim">API defense, handled</div></div></div>
  <nav id="primary-navigation" aria-label="Primary navigation" className="flex-1 space-y-3">{navGroups.map(([group,routes])=><section key={group}><h2 className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[.16em] text-side-dim">{group}</h2><div className="space-y-1">{routes.map(to=>{const item=navItems.find(([path])=>path===to);if(!item)return null;const [,label,Icon]=item;return <NavLink key={to} to={to} end onClick={()=>setOpen(false)} className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive?'bg-side-active text-side-active-ink shadow-[0_8px_20px_rgba(26,17,36,.25)] translate-x-1':'text-side-muted hover:bg-side-hover hover:translate-x-1'}`}>{({isActive})=><><Icon size={16} strokeWidth={1.5} className={isActive?'text-accent':''}/>{label}</>}</NavLink>})}</div></section>)}</nav>
  <div className="mt-5 rounded-xl bg-surface text-ink p-4"><div className="text-xs text-muted">Defense readiness</div><div className="font-serif text-3xl">{ready}%</div><div className="h-1.5 rounded bg-elev mt-2 overflow-hidden"><div className="h-full bg-[#D65CEB] shadow-[0_0_10px_#D65CEB] transition-all duration-700" style={{width:`${ready}%`}}/></div></div>
  <button onClick={logout} className="mt-4 flex items-center gap-3 px-3 text-sm text-side-muted hover:text-side-text"><LogOut size={16} strokeWidth={1.5}/>Sign out</button>
 </aside>
 <div className="min-w-0 flex-1">
  <header className="sticky top-0 z-30 flex flex-wrap items-center gap-x-4 gap-y-3 bg-bg px-4 py-3 backdrop-blur md:flex-nowrap md:px-6 md:py-4">
   <div className="order-1 flex shrink-0 items-center gap-3 md:order-none">
    <button className="md:hidden" aria-label="Menu" aria-expanded={open} aria-controls="primary-navigation" onClick={()=>setOpen(o=>!o)}><Menu size={18} strokeWidth={1.5}/></button>
   </div>
   <GlobalSearch className="order-3 w-full md:order-none md:mx-3 md:max-w-sm md:flex-1"/>
   <div className="order-2 ml-auto flex shrink-0 items-center gap-3 text-xs text-muted md:order-none md:ml-0">
    <ThemeToggle/>
    <Link to="/notifications" aria-label="Notifications" className="relative"><Bell size={18} strokeWidth={1.5}/>{unread>0&&<b className="absolute -top-2 -right-2 text-[10px] bg-[#D65CEB] text-white rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_10px_#D65CEB]">{unread>9?'9+':unread}</b>}</Link></div>
  </header>
  <AnimatePresence mode="wait"><motion.main key={loc.pathname} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.25}} className="min-w-0 px-4 pb-10 pt-2 sm:px-6 md:px-10"><Outlet/></motion.main></AnimatePresence>
 </div>
 {toast&&<div role="status" className="fixed bottom-24 right-6 nc px-4 py-3 text-sm z-40 shadow-[0_0_20px_rgba(214,92,235,.4)]">{toast}</div>}
 <Chatbot/></div>}
