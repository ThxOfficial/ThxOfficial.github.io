import { useMemo, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { TEMPLATES } from '../domain/templates';
import { createProject } from '../domain/project';
import type { TemplateId } from '../domain/types';
import Artwork from '../components/Artwork';
import StepBar from '../components/StepBar';
export default function ChoosePage({start}:{start:(t:TemplateId)=>void}) {
  const [selected,setSelected]=useState<TemplateId>('horse');
  const blanks=useMemo(()=>TEMPLATES.map(t=>createProject(t.id)),[]);
  return <main className="page-shell choose-page"><StepBar step={0}/><header className="page-heading"><h1>选一件素坯</h1><p>选好形象后，就可以给不同部位上色。</p></header><div className="template-grid">{TEMPLATES.map((t,i)=><button key={t.id} className={`template-card ${selected===t.id?'is-selected':''}`} onClick={()=>setSelected(t.id)} aria-pressed={selected===t.id}><div className="template-picture"><Artwork project={blanks[i]} stage="bisque" size={384}/><span className="choice-check">{selected===t.id?<Check size={15}/>:null}</span></div><div className="template-info"><h2>{t.name}</h2><p>{t.subtitle}</p><span>{t.regions.filter(r=>r.editable&&r.allowGlaze).length} 个可涂色部位</span></div></button>)}</div><div className="choose-action"><p>新建作品后，原来的草稿仍在「我的作品」里。</p><button className="button primary large" onClick={()=>start(selected)}>使用这个素坯<ArrowRight size={19}/></button></div></main>;
}
