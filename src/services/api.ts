import axios from 'axios'
import { mockEvents, mockStats } from '../data/mockSecurityData'
import type { SecurityEvent, SimResult, Stats } from '../types/security'
export const apiBase=()=>localStorage.getItem('cg_api')||import.meta.env.VITE_API_URL||'http://127.0.0.1:8000'
const FORCE=()=>localStorage.getItem('cg_demo')?localStorage.getItem('cg_demo')==='1':import.meta.env.VITE_DEMO_MODE==='true'
const http=axios.create({timeout:2500});http.interceptors.request.use(c=>{c.baseURL=apiBase();return c})
export type Mode='LIVE FASTAPI'|'DEMO TELEMETRY'
let localEvents:SecurityEvent[]=[...mockEvents]
let localStats:Stats={...mockStats}
async function tryLive<T>(fn:()=>Promise<T>,fallback:()=>T):Promise<{data:T;mode:Mode}>{
 if(FORCE()) return {data:fallback(),mode:'DEMO TELEMETRY'}
 try{return {data:await fn(),mode:'LIVE FASTAPI'}}catch{return {data:fallback(),mode:'DEMO TELEMETRY'}}}
export const getRoot=()=>tryLive(async()=>(await http.get('/')).data,()=>({message:'demo'}))
export const getHealth=()=>tryLive(async()=>(await http.get('/health')).data,()=>({status:'standby'}))
export const getStats=()=>tryLive<Stats>(async()=>(await http.get('/stats')).data,()=>localStats)
export const getEvents=()=>tryLive<SecurityEvent[]>(async()=>{const d=(await http.get('/events')).data;return Array.isArray(d)?d:d.events},()=>localEvents)
export const getAccount=(id:string)=>tryLive(async()=>(await http.get(`/api/accounts/${id}`)).data,()=>({id,owner:'demo'}))
function record(e:Omit<SecurityEvent,'id'|'timestamp'>){
 localEvents=[{...e,id:`INC-${1043+localEvents.length-mockEvents.length}`,timestamp:new Date().toISOString()},...localEvents]
 localStats={...localStats,total_requests:localStats.total_requests+1,threats_detected:localStats.threats_detected+1,blocked_attacks:localStats.blocked_attacks+1}}
export const simulate=(kind:'bola'|'brute-force')=>tryLive<SimResult>(async()=>{const d=(await http.post(`/simulate/${kind}`)).data
 return {attack:kind,risk_score:d.risk_score??90,explanation:d.explanation??d.reason??'Attack detected.',defender_action:d.defender_action??d.action??'Blocked',remediation:d.remediation??d.recommendation??'Review authorization.',raw:d}},
 ()=>{const bola=kind==='bola'
 const r:SimResult={attack:bola?'BOLA / IDOR':'Brute Force',risk_score:bola?92:88,explanation:bola?'User usr_3381 requested /api/accounts/9921, an object owned by another user.':'22 failed logins on /auth/login within 30 seconds.',defender_action:bola?'Request blocked; session flagged':'Source blocked for 15 minutes',remediation:bola?'Verify object ownership on every request.':'Add rate limiting and progressive lockout.',raw:{}}
 r.raw={attack:r.attack,risk_score:r.risk_score,action:r.defender_action}
 record({type:r.attack,user:bola?'usr_3381':'usr_0007',resource:bola?'/api/accounts/9921':'/auth/login',risk:r.risk_score,reason:r.explanation,status:'Blocked',recommendation:r.remediation});return r})
