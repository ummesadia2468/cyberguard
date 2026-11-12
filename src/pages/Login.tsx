import { FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import ArchHero from '../components/ArchHero'
import ThemeToggle from '../components/ThemeToggle'
import { useApp } from '../context/AppContext'
export default function Login(){
 const {authed,login}=useApp();const nav=useNavigate();const [u,setU]=useState('');const [p,setP]=useState('');const [err,setErr]=useState('')
 if(authed) return <Navigate to="/" replace/>
 const submit=(e:FormEvent)=>{e.preventDefault();if(!u.trim()||p.length<4){setErr('Enter a username and a password of at least 4 characters.');return}login();nav('/')}
 const field='w-full bg-transparent border-b py-2 outline-none focus:border-accent'
 return <div className="relative min-h-screen md:grid md:grid-cols-[55fr_45fr]">
  <div className="absolute right-4 top-4 z-20 md:right-8 md:top-8"><ThemeToggle/></div>
  <section className="hidden md:flex flex-col justify-end p-16 bg-side border-r">
   <ArchHero word="GUARD" height={300}/>
   <svg viewBox="0 0 400 120" className="w-full mb-10 text-accent" fill="none" stroke="currentColor" strokeWidth="1">{[20,45,70,95].map((y,i)=><path key={y} d={`M0 ${y} C100 ${y-20} 200 ${y+20} 400 ${y-8}`} opacity={.25+i*.2}><animate attributeName="d" dur={`${6+i}s`} repeatCount="indefinite" values={`M0 ${y} C100 ${y-20} 200 ${y+20} 400 ${y-8};M0 ${y} C100 ${y+20} 200 ${y-20} 400 ${y+8};M0 ${y} C100 ${y-20} 200 ${y+20} 400 ${y-8}`}/></path>)}</svg>
   <h2 className="font-serif text-5xl leading-[1.05] max-w-xl text-side-text">Every API request, judged before it reaches your data.</h2>
   <p className="text-side-muted mt-6 max-w-md">CyberGuard AI scans, analyzes and defends your endpoints against object-level authorization abuse and credential attacks.</p>
  </section>
  <section className="flex items-center p-8 md:p-16"><form onSubmit={submit} className="w-full max-w-sm space-y-8 bg-surface border p-8 rounded-[6px] glow">
   <h2 className="font-serif text-4xl">Sign in</h2>
   <label className="block text-sm text-muted">Username<input className={field} value={u} onChange={e=>setU(e.target.value)}/></label>
   <label className="block text-sm text-muted">Password<input type="password" className={field} value={p} onChange={e=>setP(e.target.value)}/></label>
   {err&&<p role="alert" className="text-bronze text-sm">{err}</p>}
   <button className="w-full btn font-semibold py-3 rounded-[3px]">Sign in</button>
   <button type="button" onClick={()=>{login();nav('/')}} className="w-full border py-3 rounded-[4px] hover:bg-elev">Enter demo workspace</button>
   <p className="text-xs text-muted">Authentication runs locally in this browser. The session token is stored in localStorage.</p>
  </form></section></div>}
