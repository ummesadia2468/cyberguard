import { KeyboardEvent, ReactNode, useEffect, useState } from 'react'
export interface Col<T>{h:string;f:(r:T)=>ReactNode;mono?:boolean}
export default function Table<T>({cols,rows,onRow,init='',extra}:{cols:Col<T>[];rows:T[];onRow?:(r:T)=>void;init?:string;extra?:ReactNode}){
 const [q,setQ]=useState(init);const v=rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))
 useEffect(()=>setQ(init),[init])
 const openRow=(event:KeyboardEvent<HTMLTableRowElement>,row:T)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onRow?.(row)}}
 return <div className="space-y-4"><div className="flex flex-wrap gap-3 justify-between"><input aria-label="Search" placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} className="w-72"/>{extra}</div>
 <div className="overflow-x-auto nc"><table className="w-full text-sm text-left"><thead className="bg-[var(--bg-elev)] text-muted"><tr>{cols.map(c=><th key={c.h} className="p-3 font-medium">{c.h}</th>)}</tr></thead>
 <tbody>{v.map((r,i)=><tr key={i} tabIndex={onRow?0:undefined} onClick={()=>onRow?.(r)} onKeyDown={onRow?event=>openRow(event,r):undefined} className={`border-t ${onRow?'cursor-pointer':''}`}>{cols.map(c=><td key={c.h} className={`p-3 ${c.mono?'font-mono text-xs':''}`}>{c.f(r)}</td>)}</tr>)}
 {!v.length&&<tr><td colSpan={cols.length} className="p-8 text-center text-muted">Nothing matches. Clear the search.</td></tr>}</tbody></table></div></div>}
export const Head=({t,s}:{t:string;s?:string})=><div className="mb-8"><h1 className="font-serif text-5xl">{t}</h1>{s&&<p className="text-muted mt-2 max-w-xl">{s}</p>}</div>
export const Risk=({n}:{n:number})=><span className={`font-mono px-2 py-0.5 rounded-full text-xs ${n>=80?'bg-red-500/15 text-bad':n>=40?'bg-amber-500/15 text-bronze':'bg-emerald-500/15 text-ok'}`}>{n}</span>
