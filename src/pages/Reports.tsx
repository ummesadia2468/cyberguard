import { jsPDF } from 'jspdf'
import { Download } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Head } from '../components/Table'
export default function Reports(){
 const {stats,events,log,notify}=useApp()
 const make=()=>{const d=new jsPDF();let y=22;const line=(t:string,s=10,b=false)=>{if(y>280){d.addPage();y=20}d.setFontSize(s);d.setFont('helvetica',b?'bold':'normal');d.text(d.splitTextToSize(t,180),14,y);y+=s*0.6+3}
  line('CyberGuard AI Security Report',20,true);line(`Generated ${new Date().toLocaleString()}`);y+=4
  line('Summary',14,true);line(`Total API requests: ${stats?.total_requests}`);line(`Safe requests: ${stats?.safe_requests}`);line(`Detected threats: ${stats?.threats_detected}`);line(`Blocked attacks: ${stats?.blocked_attacks}`);y+=4
  line('Incidents',14,true);events.forEach(e=>{line(`${e.id}  ${e.type}  risk ${e.risk}  ${e.status}`,10,true);line(`${e.user} -> ${e.resource}`);line(`Why: ${e.reason}`);line(`Fix: ${e.recommendation}`);y+=2})
  d.save('cyberguard-report.pdf');log('Downloaded PDF report');notify('Report downloaded')}
 return <><Head t="Reports" s="Download a PDF of current stats, incidents and fixes. It is generated in your browser."/>
 <div className="grid md:grid-cols-4 gap-6">{[['Requests',stats?.total_requests],['Safe',stats?.safe_requests],['Threats',stats?.threats_detected],['Blocked',stats?.blocked_attacks]].map(([k,v])=><div key={k as string} className="nc p-6"><div className="text-sm text-muted">{k}</div><div className="font-serif text-4xl mt-2">{(v as number|undefined)?.toLocaleString()}</div></div>)}</div>
 <p className="text-muted mt-8">{events.length} incidents will be included.</p><button onClick={make} className="bg-accent px-5 py-3 rounded-md mt-4 flex items-center gap-2 font-semibold"><Download size={16} strokeWidth={1.5}/>Download PDF</button></>}
