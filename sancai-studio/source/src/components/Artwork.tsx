import { useEffect, useRef, useState } from 'react';
import type { ArtworkStage, SancaiProject } from '../domain/types';
import { renderArtworkImage } from '../rendering/artwork';
export default function Artwork({project,stage='fired',size=768,className='',gray=false}:{project:SancaiProject;stage?:ArtworkStage;size?:number;className?:string;gray?:boolean}) {
  const c=useRef<HTMLCanvasElement>(null), token=useRef(0); const [error,setError]=useState(''),[busy,setBusy]=useState(true),[attempt,retry]=useState(0);
  useEffect(()=>{const n=++token.current;setBusy(true);setError('');if(c.current)c.current.dataset.rendered='false';
    renderArtworkImage(project,size,{stage,background:'transparent'}).then(result=>{if(n!==token.current||!c.current)return;const ctx=c.current.getContext('2d')!;ctx.clearRect(0,0,size,size);ctx.drawImage(result.canvas,0,0);c.current.dataset.rendered='true';c.current.dataset.renderSource=result.source||'rendered';setBusy(false);}).catch(e=>{if(n===token.current){setError(e instanceof Error?e.message:'图案加载失败');setBusy(false);}});
    return()=>{token.current++;};
  },[project,stage,size,attempt]);
  return <div className={`artwork ${className} ${gray?'gray-view':''}`} aria-busy={busy}><canvas ref={c} width={size} height={size} aria-label={stage==='bisque'?'卡通素坯':stage==='glazed'?'当前施釉设计':'烧成作品'} data-testid="artwork-canvas"/>{error&&<div className="render-error"><p role="alert">{error}</p><button className="button secondary" onClick={()=>retry(n=>n+1)}>重新加载图案</button></div>}</div>;
}
