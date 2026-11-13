import{c as r,u as d,r as u,j as t}from"./index-B0sDxJRJ.js";import{H as m}from"./Table-Cx-yppIm.js";import{C as l}from"./check-CYBAFWI0.js";/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=r("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]),x=[{m:"BOLA",t:"BOLA and object-level authorization",d:"Check that the signed-in user owns every object they request.",c:`@app.get("/api/accounts/{account_id}")
def get_account(account_id: int, user=Depends(current_user)):
    acct = db.get(account_id)
    if not acct or acct.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return acct`},{m:"Brute",t:"Brute force and rate limiting",d:"Limit login attempts per source and per account, then back off.",c:`@app.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, body: LoginBody):
    if failed_attempts(body.username) >= 5:
        raise HTTPException(status_code=429, detail="Locked for 15 minutes")`},{m:"Suspicious",t:"Suspicious request handling",d:"Flag unusual cadence and require step-up verification.",c:`@app.middleware("http")
async def score_requests(request: Request, call_next):
    if risk_score(request) > 50:
        log_flagged(request)
    return await call_next(request)`}];function y(){const{events:a,log:c}=d(),[n,i]=u.useState(""),o=x.map(e=>({...e,n:a.filter(s=>s.type.includes(e.m)).length})).sort((e,s)=>s.n-e.n);return t.jsxs(t.Fragment,{children:[t.jsx(m,{t:"Security recommendations",s:"Ordered by how many incidents each area has produced."}),t.jsx("div",{className:"max-w-3xl space-y-8 sm:space-y-10",children:o.map(e=>t.jsxs("section",{className:"nc min-w-0 p-4 sm:p-6",children:[t.jsxs("div",{className:"flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4",children:[t.jsx("h2",{className:"break-words font-serif text-2xl sm:text-3xl",children:e.t}),t.jsxs("span",{className:"shrink-0 font-mono text-xs text-accent",children:[e.n," incidents"]})]}),t.jsx("p",{className:"mt-2 text-muted",children:e.d}),t.jsxs("div",{className:"relative mt-4",children:[t.jsx("pre",{className:"bg-[#09060E] border rounded-md p-4 font-mono text-xs overflow-x-auto text-sky-300",children:e.c}),t.jsxs("button",{className:"absolute top-2 right-2 text-xs flex gap-1 items-center border rounded px-2 py-1",onClick:()=>{var s;(s=navigator.clipboard)==null||s.writeText(e.c),i(e.m),c(`Copied ${e.m} snippet`)},children:[n===e.m?t.jsx(l,{size:12}):t.jsx(p,{size:12}),n===e.m?"Copied":"Copy"]})]})]},e.m))})]})}export{y as default};
