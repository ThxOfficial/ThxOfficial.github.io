import { useState } from 'react';
import { ArrowRight, Copy, Download, RotateCcw, Save, ShoppingBag } from 'lucide-react';
import type { ArtworkStage, SancaiProject } from '../domain/types';
import { getTemplate } from '../domain/templates';
import { useFiredArtwork } from '../hooks/useFiredArtwork';
import Artwork from '../components/Artwork';
import KnowledgeCard from '../components/KnowledgeCard';
import StepBar from '../components/StepBar';

export default function ResultPage({project,rename,save,download,svg,refire,backup,copy,fabric,busy,recast}:{project:SancaiProject;rename:(s:string)=>void;save:()=>void;download:(background?:string)=>void;svg:()=>void;refire:()=>void;backup:()=>void;copy:()=>void;fabric:()=>void;busy:boolean;recast:()=>void}) {
  const [stage,setStage]=useState<ArtworkStage>('fired');
  const [background,setBackground]=useState('#f7f2e8');
  const template=getTemplate(project.design.templateId,project.design.templateVersion),artifact=useFiredArtwork(project);
  return <main className="page-shell result-page"><StepBar step={2}/><header className="page-heading result-heading"><h1>烧成完成</h1><p>可以切换查看上釉前后的变化。</p></header>
    <section className="result-layout"><div className="result-display"><div className="result-art">
      {stage!=='fired'||artifact.ready?<Artwork project={project} stage={stage}/>:<div className="artifact-recovery" aria-live="polite"><p>{artifact.error||'正在恢复成品…'}</p>{artifact.error&&<button className="button secondary" onClick={artifact.retry}><RotateCcw size={16}/>重试恢复</button>}</div>}
      </div><div className="stage-compare segmented" aria-label="对照制作阶段">{(['bisque','glazed','fired'] as ArtworkStage[]).map((s,i)=><button key={s} className={stage===s?'active':''} aria-pressed={stage===s} onClick={()=>setStage(s)}>{['素坯','施釉设计','烧成成品'][i]}</button>)}</div></div>
      <aside className="result-details"><span className="eyebrow">作品名称</span><label className="title-input"><span className="sr-only">作品名称</span><input aria-label="作品名称" value={project.title} maxLength={100} onChange={e=>rename(e.target.value)}/></label><dl className="work-spec"><div><dt>形象</dt><dd>{template.name}</dd></div><div><dt>烧成风格</dt><dd>{project.firing?.style==='defined'?'清晰分色':project.firing?.style==='flowing'?'明显流釉':'柔和交融'}</dd></div><div><dt>记录</dt><dd>{project.design.strokes.length} 笔自由创作 · {Object.values(project.design.regions).filter(r=>r.pattern).length} 处纹样</dd></div></dl>
        <button className="button primary large full" disabled={busy||!artifact.ready} onClick={()=>download()}><Download size={19}/>{busy?'正在准备图片…':artifact.ready?'下载透明作品 PNG':'等待恢复成品'}</button><button className="button secondary full" disabled={!artifact.ready} onClick={fabric}><ShoppingBag size={18}/>预览布料印花<ArrowRight size={17}/></button>
        {artifact.error&&<p role="alert" className="small-note">{artifact.error}。仍可下载项目备份，或复制设计重新施釉。</p>}
        <div className="result-secondary"><button className="text-button" onClick={save}><Save size={15}/>立即保存</button><button className="text-button" onClick={svg}>下载 SVG 设计稿</button></div><details className="export-background"><summary>下载带背景的图片</summary><label>背景色<select value={background} onChange={e=>setBackground(e.target.value)}><option value="#f7f2e8">暖白</option><option value="#e8ede5">浅绿</option><option value="#eee2d4">浅褐</option></select></label><button className="button secondary" disabled={busy||!artifact.ready} onClick={()=>download(background)}>下载背景 PNG</button></details><div className="result-backup"><p>SVG 保留形状、配色和纹样。烧成光泽和流釉可用 PNG 保留。</p><button className="text-button" onClick={backup}>下载项目备份<Download size={14}/></button><button className="text-button" onClick={copy}><Copy size={14}/>复制并修改</button><button className="text-button" onClick={refire}><RotateCcw size={14}/>另烧一版</button><small>沿用配色与纹样，生成新的烧成效果，原作也会保留。</small></div>
        {getTemplate(project.design.templateId).version>project.design.templateVersion&&<div className="template-refresh compact"><p>重绘素坯已可用。带入底釉与纹样，原作保留；自由笔触需重画。</p><button className="button secondary" onClick={recast}>用新造型再创作<ArrowRight size={15}/></button></div>}
        <p className="small-note">透明图片仅将形象外部设为透明，奶白釉和素胎均完整保留。未包含展示背景和印章。</p>
        <KnowledgeCard id="today"/>{['official','guardian'].includes(template.id)&&<details className="craft-material-note"><summary>人物的面部为什么保留？</summary><p>一些人物陶俑在未施釉的面部另加彩绘。本工坊保护五官和手部，让施釉后仍能清楚辨认表情。</p><a href="https://www.chinamuseum.org.cn/detail.html?contentId=829&id=14" target="_blank" rel="noreferrer">中国博物馆协会 · 工艺说明</a></details>}
      </aside></section></main>;
}
