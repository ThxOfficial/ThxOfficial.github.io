import { Check } from 'lucide-react';
export default function StepBar({step}:{step:number}) {return <ol className="step-bar" aria-label="制作流程">{['选取素坯','亲手施釉','窑火成彩','带入生活'].map((s,i)=><li key={s} className={i===step?'current':i<step?'done':''} aria-current={i===step?'step':undefined}><span>{i<step?<Check size={14}/>:String(i+1).padStart(2,'0')}</span>{s}</li>)}</ol>;}
