export type Status='Allowed'|'Blocked'|'Flagged'
export interface SecurityEvent{id:string;type:string;user:string;resource:string;risk:number;reason:string;status:Status;timestamp:string;recommendation:string}
export interface Stats{total_requests:number;safe_requests:number;threats_detected:number;blocked_attacks:number}
export interface SimResult{attack:string;risk_score:number;explanation:string;defender_action:string;remediation:string;raw:Record<string,unknown>}
