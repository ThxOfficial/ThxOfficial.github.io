import { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, MapPin } from 'lucide-react';
import type { ArtworkStage, TemplateId } from '../domain/types';
import { CLAY_NOTE, HERITAGE_PLACES, KNOWLEDGE, PROCESS_STEPS } from '../content/craft';
import { TEMPLATES } from '../domain/templates';
import { createExample } from '../domain/example';
import Artwork from '../components/Artwork';
import KnowledgeCard from '../components/KnowledgeCard';
import CultureEntry from '../components/CultureEntry';
import CulturePhoto from '../components/CulturePhoto';
import { OBJECTS } from '../content/objects';

export default function ExplorePage({start}:{start:(id:TemplateId)=>void}) {
  const [stage,setStage]=useState<ArtworkStage>('bisque'),[selected,setSelected]=useState<TemplateId>('horse'),[place,setPlace]=useState('kiln');
  const examples=useMemo(()=>TEMPLATES.map((t,i)=>createExample(t.id,34815+i*971)),[]);
  const demo=examples.find(p=>p.design.templateId===selected)!,location=HERITAGE_PLACES.find(p=>p.id===place)!;
  return <main className="page-shell explore-page">
    <header className="page-heading"><h1>认识唐三彩</h1><p>看看文物和工艺，再选一件你想上色的素坯。</p></header>
    <div className="explore-template-options" aria-label="探索形象">{TEMPLATES.map(t=><button key={t.id} aria-pressed={selected===t.id} className={selected===t.id?'active':''} onClick={()=>setSelected(t.id)}>{t.name}</button>)}</div>
    <section className="explore-stage"><div className="explore-image"><Artwork project={demo} stage={stage}/></div><div><p className="eyebrow">同一形象 · 三个阶段</p><h2>{stage==='bisque'?'素坯是什么样的？':stage==='glazed'?'施釉后是什么样的？':'烧成后哪里变了？'}</h2><p>{stage==='bisque'?'素坯已经素烧定形，表面还没有上釉，能清楚看到器形和细节。':stage==='glazed'?'先为不同部位选颜色，再加点彩或花纹。这里的颜色用于设计参考。':'注意釉面的光泽和色块边缘。切回施釉阶段，可以对照同一幅图案的变化。'}</p><div className="segmented" aria-label="查看制作阶段">{(['bisque','glazed','fired'] as ArtworkStage[]).map((s,i)=><button key={s} aria-pressed={stage===s} className={stage===s?'active':''} onClick={()=>setStage(s)}>{['素坯','施釉设计','烧成成品'][i]}</button>)}</div><button className="text-button" onClick={()=>start(selected)}>用这个形象创作<ArrowRight size={17}/></button></div></section>
    <CultureEntry key={selected} entry={OBJECTS[selected]} slot={selected} showPhoto/>
    <section className="history-section"><h2>唐三彩的历史</h2><div className="history-timeline">
      <article><span>618—907 年 · 唐代</span><h3>多彩的陶器与人物</h3><p>马、骆驼、人物和器皿都是常见题材。许多出土唐三彩属于随葬明器，也有涉及实用与外销的馆藏解释。</p><a href="https://www.metmuseum.org/art/collection/search/44805" target="_blank" rel="noreferrer">The Met · Horse and rider<ExternalLink size={13}/></a></article>
      <article><span>窑址与出土文物</span><h3>河南留下的线索</h3><p>黄冶窑址讲述生产，洛阳出土文物提供具体作品的线索。古代的生产地与后来发现文物的地点需要分开认识。</p><button className="text-button" onClick={()=>document.getElementById('henan-map')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}>查看河南关联图<ArrowRight size={14}/></button></article>
      <article><span>2008 年 · 非遗传承</span><h3>技艺在今天延续</h3><p>洛阳相关烧制技艺列入第二批国家级非物质文化遗产名录。网页卡通与布料印花，是今天围绕这一题材展开的设计。</p><a href="https://www.ihchina.cn/ccr_detail/14450/" target="_blank" rel="noreferrer">中国非物质文化遗产网<ExternalLink size={13}/></a></article>
    </div></section>
    <section className="heritage-section" id="henan-map"><p className="eyebrow">河南关联 · 地点与身份</p><h2>唐三彩与河南</h2><div className="heritage-layout"><div className="heritage-map" role="img" aria-label="河南关联位置示意：洛阳位于巩义黄冶以西。此图不按比例绘制。"><span className="map-orientation">西 ←　河南关联示意　→ 东</span><svg viewBox="0 0 600 300" aria-hidden="true"><path d="M60 210 Q170 90 295 150 Q400 205 540 92"/><path d="M70 225 Q230 270 365 212 Q475 155 540 190"/></svg><span className="map-city luoyang">洛阳</span><span className="map-city gongyi">巩义 · 黄冶</span><i className="map-marker" style={{left:`${location.x}%`,top:`${location.y}%`}}><MapPin size={30}/></i><small>位置关系示意，不按比例绘制</small></div><div className="heritage-details"><div className="heritage-tabs" aria-label="地点身份">{HERITAGE_PLACES.map(p=><button key={p.id} aria-pressed={place===p.id} className={place===p.id?'active':''} onClick={()=>setPlace(p.id)}>{p.kind}</button>)}</div><p className="eyebrow">{location.kind}</p><h3>{location.name}</h3><p>{location.body}</p><a href={location.source} target="_blank" rel="noreferrer">{location.sourceTitle}<ExternalLink size={13}/></a></div></div></section>
    <CulturePhoto slot="kiln" label="唐三彩窑址或制作工艺"/>
    <section className="process-section"><h2>唐三彩怎么烧出来？</h2><div className="process-grid">{PROCESS_STEPS.map((s,i)=><article key={s.title}><span>{String(i+1).padStart(2,'0')}</span><h3>{s.title}</h3><p>{s.body}</p></article>)}</div><p className="small-note">这里演示洛阳传承中常见的两次烧成。历史上也有一次烧成的做法。</p><details className="craft-material-note"><summary>{CLAY_NOTE.title}</summary><p>{CLAY_NOTE.body}</p><a href={CLAY_NOTE.source} target="_blank" rel="noreferrer">{CLAY_NOTE.sourceTitle}<ExternalLink size={13}/></a></details></section>
    <section className="knowledge-grid" aria-label="唐彩知识卡">{KNOWLEDGE.map(k=><KnowledgeCard key={k.id} id={k.id}/>)}</section>
    <section className="asset-note"><details><summary>图形、布料模板与资料来源</summary><p>本工坊的可上色图形经过独立重绘，参考唐三彩题材与文物结构；用户提供的文物照片、插画及水印图未直接打包为填色素材。帆布袋与 T 恤沿用用户提供模板的矢量重绘。作品是当代数字设计，不作为文物测绘复原。</p><p>图形参考：<a href="https://www.metmuseum.org/art/collection/search/62847" target="_blank" rel="noreferrer">The Met · Horse</a>、<a href="https://www.metmuseum.org/art/collection/search/49368" target="_blank" rel="noreferrer">The Met · Camel</a>，以及用户提供的文官、守护俑实物图。工艺事实来源见各知识卡。</p></details></section>
    <div className="explore-create"><button className="button primary large" onClick={()=>start(selected)}>开始创作<ArrowRight size={17}/></button></div>
  </main>;
}
