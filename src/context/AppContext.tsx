import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import * as api from '../services/api'
import type { SecurityEvent, Stats } from '../types/security'
export interface Notif{id:string;msg:string;t:string;read:boolean}
export interface Audit{t:string;msg:string}
export type Theme='dark'|'light'
interface Ctx{events:SecurityEvent[];stats:Stats|null;mode:api.Mode;refresh:()=>Promise<void>;refreshing:boolean;refreshError:string|null;lastUpdated:Date|null;theme:Theme;toggleTheme:()=>void;toast:string|null;notify:(m:string)=>void;authed:boolean;login:(identity?:string)=>void;logout:()=>void;notifs:Notif[];setNotifs:(f:(n:Notif[])=>Notif[])=>void;audit:Audit[];log:(m:string)=>void}
const C=createContext<Ctx>(null!)
export const useApp=()=>useContext(C)
const ls=<T,>(k:string,d:T):T=>{try{return JSON.parse(localStorage.getItem(k)||'')}catch{return d}}
export function AppProvider({children}:{children:ReactNode}){
 const [events,setEvents]=useState<SecurityEvent[]>([]);const [stats,setStats]=useState<Stats|null>(null)
 const [mode,setMode]=useState<api.Mode>('DEMO TELEMETRY');const [toast,setToast]=useState<string|null>(null)
 const [refreshing,setRefreshing]=useState(false);const [refreshError,setRefreshError]=useState<string|null>(null);const [lastUpdated,setLastUpdated]=useState<Date|null>(null)
 const [theme,setTheme]=useState<Theme>(()=>localStorage.getItem('cg_theme')==='light'?'light':'dark')
 const [authed,setAuthed]=useState(!!localStorage.getItem('cg_token'))
 const [notifs,setN]=useState<Notif[]>(()=>ls('cg_notifs',[]));const [audit,setAudit]=useState<Audit[]>(()=>ls('cg_audit',[]))
 const seen=useRef<Set<string>|null>(null)
 useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('cg_theme',theme)},[theme])
 useEffect(()=>{localStorage.setItem('cg_notifs',JSON.stringify(notifs))},[notifs])
 useEffect(()=>{localStorage.setItem('cg_audit',JSON.stringify(audit))},[audit])
 const notify=useCallback((m:string)=>{setToast(m);setTimeout(()=>setToast(null),3500)},[])
 const log=useCallback((m:string)=>setAudit(a=>[{t:new Date().toISOString(),msg:m},...a].slice(0,100)),[])
 const refresh=useCallback(async()=>{setRefreshing(true);setRefreshError(null)
  try{const [s,e]=await Promise.all([api.getStats(),api.getEvents()]);setStats(s.data);setEvents(e.data);setMode(s.mode==='LIVE FASTAPI'&&e.mode==='LIVE FASTAPI'?'LIVE FASTAPI':'DEMO TELEMETRY');setLastUpdated(new Date())
   if(seen.current){const fresh=e.data.filter(x=>!seen.current!.has(x.id));if(fresh.length){setN(n=>[...fresh.map(f=>({id:f.id,msg:`${f.status}: ${f.type} on ${f.resource}`,t:new Date().toISOString(),read:false})),...n].slice(0,50));notify(`New incident: ${fresh[0].type} ${fresh[0].status.toLowerCase()}`)}}
   seen.current=new Set(e.data.map(x=>x.id))
  }catch(error){setRefreshError(error instanceof Error?`Unable to refresh telemetry: ${error.message}`:'Unable to refresh telemetry. Please try again.')}
  finally{setRefreshing(false)}},[notify])
 useEffect(()=>{if(!authed)return;refresh();const i=setInterval(refresh,Number(localStorage.getItem('cg_poll'))||8000);return()=>clearInterval(i)},[authed,refresh])
 return <C.Provider value={{events,stats,mode,refresh,refreshing,refreshError,lastUpdated,theme,toggleTheme:()=>setTheme(current=>current==='dark'?'light':'dark'),toast,notify,authed,login:(identity)=>{localStorage.setItem('cg_token','demo-'+Date.now());setAuthed(true);log(identity?`Signed in as ${identity}`:'Signed in')},logout:()=>{localStorage.removeItem('cg_token');setAuthed(false)},notifs,setNotifs:setN,audit,log}}>{children}</C.Provider>}
