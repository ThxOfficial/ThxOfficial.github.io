import { useEffect, useMemo, useRef } from 'react';
import type { PointerEvent } from 'react';
import type { BrushStroke, GlazeId, SancaiProject, SancaiTemplate } from '../domain/types';
import { GLAZE_HEX } from '../domain/palettes';
import Artwork from './Artwork';
export default function GlazeEditor({project,template,selected,select,tool,brushColor,radius,stroke,view='glazed',gray=false}:{project:SancaiProject;template:SancaiTemplate;selected:string;select:(id:string)=>void;tool:'fill'|'brush';brushColor:GlazeId;radius:number;stroke:(s:BrushStroke)=>void;view?:'bisque'|'glazed';gray?:boolean}) {
  const line=useRef<SVGPathElement>(null),drawing=useRef<{id:number;region:string;points:[number,number][];glaze:GlazeId;radius:number}|null>(null);
  const ordered=useMemo(()=>[...template.regions].sort((a,b)=>a.zIndex-b.zIndex),[template]);
  const hitPaths=useMemo(()=>ordered.map(region=>({region,path:new Path2D(region.path)})).reverse(),[ordered]);
  const context=useMemo(()=>document.createElement('canvas').getContext('2d')!,[]);
  const cancel=()=>{drawing.current=null;line.current?.setAttribute('d','');};
  useEffect(()=>{cancel();const escape=(e:KeyboardEvent)=>{if(e.key==='Escape')cancel();};window.addEventListener('keydown',escape);return()=>{window.removeEventListener('keydown',escape);cancel();};},[project.id,tool,view]);
  const point=(x:number,y:number,r:DOMRect):[number,number]=>{const clamp=(v:number)=>Math.max(0,Math.min(1024,v));return[clamp((x-r.left)/r.width*1024),clamp((y-r.top)/r.height*1024)];};
  const paintLine=()=>{const d=drawing.current;if(!d||!line.current)return;line.current.setAttribute('d',d.points.map((p,i)=>`${i?'L':'M'}${p[0]},${p[1]}`).join(' ')+' l.01,.01');line.current.setAttribute('mask',`url(#brush-${d.region})`);line.current.setAttribute('stroke',GLAZE_HEX[d.glaze]);line.current.setAttribute('stroke-width',String(d.radius*2));};
  const begin=(e:PointerEvent<SVGSVGElement>)=>{if(e.button!==0||drawing.current)return;const p=point(e.clientX,e.clientY,e.currentTarget.getBoundingClientRect());const r=hitPaths.find(item=>context.isPointInPath(item.path,...p))?.region;if(!r?.editable||!r.allowGlaze)return;select(r.id);if(tool==='brush'){e.currentTarget.setPointerCapture(e.pointerId);drawing.current={id:e.pointerId,region:r.id,points:[p],glaze:brushColor,radius};paintLine();}};
  const move=(e:PointerEvent<SVGSVGElement>)=>{const d=drawing.current;if(!d||d.id!==e.pointerId)return;const r=e.currentTarget.getBoundingClientRect(),samples=e.nativeEvent.getCoalescedEvents?.()||[];for(const sample of samples.length?samples:[e.nativeEvent]){const p=point(sample.clientX,sample.clientY,r),last=d.points.at(-1)!;if(Math.hypot(p[0]-last[0],p[1]-last[1])<Math.max(1.5,d.radius/5))continue;if(d.points.length>=256)d.points=d.points.filter((_,i)=>i===0||i%2===1);d.points.push(p);}paintLine();};
  const end=(e:PointerEvent<SVGSVGElement>)=>{const d=drawing.current;if(!d||d.id!==e.pointerId)return;const p=point(e.clientX,e.clientY,e.currentTarget.getBoundingClientRect());if(d.points.length<256&&Math.hypot(p[0]-d.points.at(-1)![0],p[1]-d.points.at(-1)![1])>1)d.points.push(p);cancel();stroke({id:crypto.randomUUID(),regionId:d.region,glaze:d.glaze,radius:d.radius,points:d.points});};
  return <div className={`glaze-editor ${tool==='brush'&&view==='glazed'?'brush-active':''}`}>
    <Artwork project={project} stage={view} gray={gray}/>
    {view==='glazed'&&<svg viewBox="0 0 1024 1024" className="region-overlay" aria-label="可点击的涂釉区域" onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={cancel} onLostPointerCapture={cancel}>
      <defs><clipPath id="editor-silhouette"><path d={template.silhouette} clipRule={template.silhouetteFillRule}/></clipPath>{ordered.filter(r=>r.editable).map(r=><mask id={`brush-${r.id}`} key={r.id} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024"><rect width="1024" height="1024" fill="black"/><path d={r.path} fill="white"/>{ordered.filter(over=>over.zIndex>r.zIndex).map(over=><path key={over.id} d={over.path} fill="black"/>)}</mask>)}</defs>
      <g clipPath="url(#editor-silhouette)">{ordered.filter(r=>r.editable&&r.id===selected).map(r=><path key={r.id} d={r.path} mask={`url(#brush-${r.id})`} className="selected-region"/>)}
      <path ref={line} fill="none" stroke={GLAZE_HEX[brushColor]} strokeWidth={radius*2} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none"/></g>
    </svg>}
  </div>;
}
