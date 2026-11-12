import { useApp } from '../context/AppContext'
import Table, { Head } from '../components/Table'
export default function Audit(){const {audit}=useApp();return <><Head t="Audit log" s="Actions taken in this workspace, newest first."/><Table rows={audit} cols={[{h:'Time',f:a=>new Date(a.t).toLocaleString(),mono:true},{h:'Action',f:a=>a.msg}]}/></>}
