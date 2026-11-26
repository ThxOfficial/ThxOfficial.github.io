import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Flame, RotateCcw } from 'lucide-react';
import type { SancaiProject } from '../domain/types';
import { ensureFiredArtifact } from '../rendering/artwork';
import Artwork from '../components/Artwork';
import StepBar from '../components/StepBar';
export default function KilnPage({project,complete,cancel}:{project:SancaiProject;complete:(id:string)=>void;cancel:()=>void}) {
  const [progress,setProgress]=useState(0),[ready,setReady]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0),[skipped,setSkipped]=useState(false);
  const completeRef=useRef(complete); completeRef.current=complete;
  useEffect(()=>{let active=true,rendered=false;const started=performance.now();setProgress(0);setReady(false);setError('');
    ensureFiredArtifact(project,768).then(()=>{if(active){rendered=true;setReady(true);}}).catch(e=>{if(active)setError(e instanceof Error?e.message:'烧成图案暂时没有准备好，请重试。');});
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer=window.setInterval(()=>{if(!active)return;const p=reduced?1:Math.min(1,(performance.now()-started)/8000);setProgress(rendered?p:Math.min(.9,p));},100);
    return()=>{active=false;clearInterval(timer);};
  },[project.firing?.id,retry]);
  useEffect(()=>{if(ready&&(skipped||progress>=1)&&project.firing)completeRef.current(project.firing.id);},[ready,skipped,progress,project.firing?.id]);
  const stage=Math.min(3,Math.floor(progress*4));
  return <main className="page-shell kiln-page"><StepBar step={2}/><header className="page-heading"><h1>{['正在升温','釉色开始交融','正在冷却','准备出窑'][stage]}</h1><p>留意色块边缘和釉面的光泽。</p></header><section className={`kiln-scene kiln-stage-${stage}`}><div className="kiln-arch"><div className="kiln-glow"/><Artwork project={project} stage={stage>=1&&ready?'fired':'glazed'}/><div className="kiln-door"/></div><div className="kiln-base"><Flame size={20}/><span>{['装窑与升温','熔釉与交融','冷却','开窑'][stage]}</span><span>{Math.round(progress*100)}%</span></div><div className="kiln-progress"><i style={{width:`${progress*100}%`}}/></div></section><div className="kiln-steps">{['装窑升温','釉色交融','自然冷却','开窑见彩'].map((s,i)=><span key={s} className={i<=stage?'active':''}><i>{i+1}</i>{s}</span>)}</div>{error?<div className="error-banner"><p role="alert">{error}</p><button className="button secondary" onClick={()=>setRetry(x=>x+1)}><RotateCcw size={16}/>重新计算</button></div>:<button className="text-button" onClick={()=>setSkipped(true)} disabled={skipped}>{skipped&&!ready?'正在准备成品…':'跳过动画，直接看成品'}<ArrowRight size={16}/></button>}<button className="subtle-link" onClick={cancel}>返回继续施釉</button><p className="small-note">网页时间经过压缩。釉面变化为数字效果，不表示真实窑温、用时或材料显色预测。</p></main>;
}
