import { useEffect, useState } from 'react';
export default function Range({label,value,min,max,step=1,suffix='',change}:{label:string;value:number;min:number;max:number;step?:number;suffix?:string;change:(n:number)=>void}) {
  const [draft,setDraft]=useState(value); useEffect(()=>setDraft(value),[value]);
  const commit=()=>{if(draft!==value) change(draft);};
  return <label className="range-label"><span>{label}<small>{Math.round(draft*100)/100}{suffix}</small></span><input type="range" aria-label={label} value={draft} min={min} max={max} step={step} onChange={e=>setDraft(Number(e.target.value))} onPointerUp={commit} onKeyUp={commit} onBlur={commit}/></label>;
}
