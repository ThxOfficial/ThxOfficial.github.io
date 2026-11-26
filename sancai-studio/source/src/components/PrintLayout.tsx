import { useEffect, useState } from 'react';
import { createExample } from '../domain/example';
import { TEMPLATES } from '../domain/templates';
import type { Placement, SancaiProject } from '../domain/types';
import { listProjects } from '../persistence/database';

export default function PrintLayout({project,placement,change}:{
  project:SancaiProject;
  placement:Placement;
  change:(next:Placement)=>void;
}) {
  const [saved,setSaved] = useState<SancaiProject[]>([]);
  useEffect(()=>{
    let live=true;
    listProjects().then(records=>{
      if(live)setSaved(records.map(r=>r.project).filter(p=>p.id!==project.id&&p.phase==='finished'));
    }).catch(()=>{ if(live)setSaved([]); });
    return()=>{live=false;};
  },[project.id]);
  const add = (source:SancaiProject) => {
    if(!source.firing)return;
    const {design,style,seed}=source.firing;
    change({...placement,layout:'pair',companion:{title:source.title,design,style,seed}});
  };
  const options = [
    {id:'single',name:'单个图案'},
    {id:'repeat',name:'重复铺排'},
    {id:'pair',name:'双图拼贴'},
  ] as const;
  return <div className="print-layout-settings">
    <h3>图案排版</h3>
    <div className="explore-template-options" aria-label="图案排版方式">
      {options.map(option=><button key={option.id} type="button"
        aria-pressed={(placement.layout??'single')===option.id}
        className={(placement.layout??'single')===option.id?'active':''}
        onClick={()=>{
          if(option.id==='pair') {
            if(placement.companion)change({...placement,layout:'pair'});
            else add(createExample(TEMPLATES.find(t=>t.id!==project.design.templateId)!.id));
          } else change({...placement,layout:option.id,companion:undefined});
        }}>{option.name}</button>)}
    </div>
    {placement.layout==='pair'&&<label className="layout-companion">
      第二件作品
      <select aria-label="选择第二件作品" value="" onChange={event=>{
        const id=event.target.value;
        const sample=TEMPLATES.find(t=>`example-${t.id}`===id);
        const source=sample?createExample(sample.id):saved.find(p=>`saved-${p.id}`===id);
        if(source)add(source);
      }}>
        <option value="" disabled>{placement.companion?.title || '选择作品'}</option>
        {saved.length>0&&<optgroup label="我的烧成作品">{saved.map(p=><option key={p.id} value={`saved-${p.id}`}>{p.title||'未命名作品'}</option>)}</optgroup>}
        <optgroup label="工坊示例">{TEMPLATES.map(t=><option key={t.id} value={`example-${t.id}`}>{t.name}</option>)}</optgroup>
      </select>
    </label>}
  </div>;
}
