import { ArrowLeft, Check, Download, Move, RotateCcw } from 'lucide-react';
import type { Placement, ProductId, SancaiProject } from '../domain/types';
import { PRODUCTS } from '../rendering/product';
import { useFiredArtwork } from '../hooks/useFiredArtwork';
import ProductPreview from '../components/ProductPreview';
import Range from '../components/Range';
import KnowledgeCard from '../components/KnowledgeCard';
import StepBar from '../components/StepBar';
import PrintLayout from '../components/PrintLayout';
const COLORS=[{color:'#ffffff',name:'纯白'},{color:'#fffdf3',name:'暖米白'},{color:'#edf3ef',name:'浅青灰'}];
export default function FabricPage({project,select,place,download,back,busy}:{project:SancaiProject;select:(id:ProductId)=>void;place:(p:Placement)=>void;download:()=>void;back:()=>void;busy:boolean}) {
  const product=project.activeProduct,p=project.products[product],artifact=useFiredArtwork(project);
  const reset=()=>place({...p,x:.5,y:product==='tote'?.65:product==='shirt'?.51:.53,scale:product==='tote'?.43:product==='shirt'?.38:.75,rotation:0});
  return <main className="page-shell fabric-page"><StepBar step={3}/><header className="page-heading heading-row"><div><h1>布料印花预览</h1><p>选择布料，再调整图案的位置和大小。</p></div><button className="text-button" onClick={back}><ArrowLeft size={16}/>回到作品</button></header>
    {!artifact.ready&&<div className="artifact-status" aria-live="polite"><p>{artifact.error||'正在恢复成品，完成后即可预览与导出。'}</p>{artifact.error&&<button className="button secondary" onClick={artifact.retry}>重试恢复成品</button>}</div>}
    <section className="fabric-layout"><div className="fabric-display">{artifact.ready?<ProductPreview project={project} product={product} change={place}/>:<div className="artifact-recovery">等待成品恢复</div>}<p className="drag-hint"><Move size={15}/>拖动预览中的图案可调整位置</p></div><aside className="fabric-controls"><h2>选择要印的布料</h2><div className="product-options">{PRODUCTS.map(item=><button key={item.id} className={product===item.id?'active':''} aria-pressed={product===item.id} onClick={()=>select(item.id)}><span>{item.name}</span>{product===item.id&&<Check size={17}/>}</button>)}</div>
      <div className="control-divider"/><PrintLayout project={project} placement={p} change={place}/><h3>图案的位置</h3><Range label="水平位置" value={p.x} min={.1} max={.9} step={.01} change={v=>place({...p,x:v})}/><Range label="垂直位置" value={p.y} min={.2} max={.85} step={.01} change={v=>place({...p,y:v})}/><Range label="图案大小" value={p.scale} min={.1} max={.85} step={.01} change={v=>place({...p,scale:v})}/><Range label="旋转" value={p.rotation} min={-180} max={180} suffix="°" change={v=>place({...p,rotation:v})}/><button className="text-button" onClick={reset}><RotateCcw size={14}/>居中并还原大小</button>
      <div className="control-divider"/><h3>布料颜色</h3><div className="fabric-colors">{COLORS.map(c=><button key={c.color} aria-label={`布料颜色：${c.name}`} aria-pressed={p.color===c.color} className={p.color===c.color?'active':''} onClick={()=>place({...p,color:c.color})}><i style={{background:c.color}}>{p.color===c.color&&<Check size={17}/>}</i><small>{c.name}</small></button>)}</div><button className="button primary full large" disabled={busy||!artifact.ready} onClick={download}><Download size={18}/>{busy?'正在准备效果图…':artifact.ready?'下载应用效果图':'等待恢复成品'}</button><p className="small-note">这是数字印花效果预览，不是将陶釉烧在布料上。白釉与素胎区域均保留在图案中。</p><KnowledgeCard id="today"/>
    </aside></section></main>;
}
