import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Head } from '../components/Table'
const R=[{m:'BOLA',t:'BOLA and object-level authorization',d:'Check that the signed-in user owns every object they request.',c:'@app.get("/api/accounts/{account_id}")\ndef get_account(account_id: int, user=Depends(current_user)):\n    acct = db.get(account_id)\n    if not acct or acct.owner_id != user.id:\n        raise HTTPException(status_code=403, detail="Forbidden")\n    return acct'},
{m:'Brute',t:'Brute force and rate limiting',d:'Limit login attempts per source and per account, then back off.',c:'@app.post("/auth/login")\n@limiter.limit("5/minute")\nasync def login(request: Request, body: LoginBody):\n    if failed_attempts(body.username) >= 5:\n        raise HTTPException(status_code=429, detail="Locked for 15 minutes")'},
{m:'Suspicious',t:'Suspicious request handling',d:'Flag unusual cadence and require step-up verification.',c:'@app.middleware("http")\nasync def score_requests(request: Request, call_next):\n    if risk_score(request) > 50:\n        log_flagged(request)\n    return await call_next(request)'}]
export default function Recommendations(){
 const {events,log}=useApp();const [cp,setCp]=useState('')
 const rows=R.map(r=>({...r,n:events.filter(e=>e.type.includes(r.m)).length})).sort((a,b)=>b.n-a.n)
 return <><Head t="Security recommendations" s="Ordered by how many incidents each area has produced."/>
 <div className="space-y-10 max-w-3xl">{rows.map(r=><section key={r.m} className="nc p-6"><div className="flex justify-between gap-4"><h2 className="font-serif text-3xl">{r.t}</h2><span className="font-mono text-xs text-accent">{r.n} incidents</span></div><p className="text-muted mt-2">{r.d}</p>
 <div className="relative mt-4"><pre className="bg-[#09060E] border rounded-md p-4 font-mono text-xs overflow-x-auto text-sky-300">{r.c}</pre>
 <button className="absolute top-2 right-2 text-xs flex gap-1 items-center border rounded px-2 py-1" onClick={()=>{navigator.clipboard?.writeText(r.c);setCp(r.m);log(`Copied ${r.m} snippet`)}}>{cp===r.m?<Check size={12}/>:<Copy size={12}/>}{cp===r.m?'Copied':'Copy'}</button></div></section>)}</div></>}
