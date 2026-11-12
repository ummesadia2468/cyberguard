import type { SecurityEvent, Stats } from '../types/security'
const now=Date.now()
const ts=(m:number)=>new Date(now-m*60000).toISOString()
export const mockEvents:SecurityEvent[]=[
{id:'INC-1042',type:'BOLA / IDOR',user:'usr_3381',resource:'/api/accounts/9921',risk:92,reason:'User requested an account object it does not own.',status:'Blocked',timestamp:ts(3),recommendation:'Enforce object-level ownership checks on every account lookup.'},
{id:'INC-1041',type:'Brute Force',user:'usr_0007',resource:'/auth/login',risk:88,reason:'14 failed logins in 40 seconds from one source.',status:'Blocked',timestamp:ts(11),recommendation:'Apply per-IP and per-account rate limits with lockout backoff.'},
{id:'INC-1040',type:'Suspicious Request',user:'usr_5120',resource:'/api/accounts/5120',risk:54,reason:'Unusual request cadence for this user profile.',status:'Flagged',timestamp:ts(26),recommendation:'Review the session and require step-up authentication.'},
{id:'INC-1039',type:'Normal Traffic',user:'usr_2210',resource:'/api/accounts/2210',risk:6,reason:'Owner accessed own object.',status:'Allowed',timestamp:ts(31),recommendation:'No action required.'},
{id:'INC-1038',type:'BOLA / IDOR',user:'usr_4402',resource:'/api/accounts/1003',risk:90,reason:'Sequential object ID enumeration detected.',status:'Blocked',timestamp:ts(48),recommendation:'Use non-guessable identifiers and verify ownership server-side.'},
{id:'INC-1037',type:'Suspicious Request',user:'usr_8891',resource:'/health',risk:41,reason:'High-volume probing of a public endpoint.',status:'Flagged',timestamp:ts(75),recommendation:'Throttle unauthenticated probes.'}]
export const mockStats:Stats={total_requests:12840,safe_requests:12512,threats_detected:328,blocked_attacks:271}
export const activitySeries=Array.from({length:12},(_,i)=>({t:`${String(i*2).padStart(2,'0')}:00`,threats:Math.round(8+Math.abs(Math.sin(i))*34),blocked:Math.round(6+Math.abs(Math.sin(i))*28)}))
