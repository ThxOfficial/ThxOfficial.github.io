import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Download, Menu, Redo2, Save, Undo2, X } from 'lucide-react';
import { useProject } from './hooks/useProject';
import { useRoute } from './hooks/useRoute';
import { ACTIVE_PROJECT_KEY, beginFiring, cancelFiring, cloneForEditing, createProject, finishFiring, recastForEditing } from './domain/project';
import { createExample } from './domain/example';
import type { FiringStyle, Placement, SancaiProject, TemplateId } from './domain/types';
import { deleteProject, readProject } from './persistence/database';
import { projectBlob, readProjectFile } from './persistence/projectFile';
import { validateProject } from './domain/validation';
import { blobFromCanvas, canvas, download } from './rendering/common';
import { ensureFiredArtifact } from './rendering/artwork';
import { renderProjectProduct } from './rendering/product';
import { vectorDesign } from './rendering/vector';
import HomePage from './pages/HomePage';
import ChoosePage from './pages/ChoosePage';
import ExplorePage from './pages/ExplorePage';
import StudioPage from './pages/StudioPage';
import KilnPage from './pages/KilnPage';
import ResultPage from './pages/ResultPage';
import FabricPage from './pages/FabricPage';
import GalleryPage from './pages/GalleryPage';
import Dialog from './components/Dialog';

const makeDemo = () => createExample('horse');
const routeFor=(p:SancaiProject)=>`/${p.phase==='finished'?'result':p.phase==='firing'?'kiln':'studio'}/${p.id}`;

export default function App() {
  const api=useProject(),{project}=api,{route,navigate}=useRoute(),demo=useMemo(makeDemo,[]);
  const [message,setMessage]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(false),[routeError,setRouteError]=useState(''),[galleryTick,setGalleryTick]=useState(0),[menu,setMenu]=useState(false);
  const input=useRef<HTMLInputElement>(null),loadToken=useRef(0),projectRef=useRef(project); projectRef.current=project;
  const notify=useCallback((s:string)=>setMessage(s),[]);
  const [replacement,setReplacement]=useState<{error:string;run:()=>void}|null>(null);
  const replaceSafely=async(run:()=>void)=>{try{await api.saveNow();run();}catch(e){setReplacement({error:e instanceof Error?e.message:'当前作品保存失败。',run});}};
  useEffect(()=>{if(!message)return;const t=setTimeout(()=>setMessage(''),6500);return()=>clearTimeout(t);},[message]);
  const segments=route.split('/').filter(Boolean),page=segments[0]||'home',routeId=segments[1];
  useEffect(()=>{const token=++loadToken.current;let id:string|undefined=routeId;
    if(!id&&!projectRef.current){try{id=localStorage.getItem(ACTIVE_PROJECT_KEY)||undefined;}catch{}}
    if(!id||id===projectRef.current?.id){setLoading(false);setRouteError('');return;}
    setLoading(!!routeId);setRouteError('');
    api.saveNow().then(()=>token===loadToken.current?readProject(id!):undefined).then(value=>{if(token!==loadToken.current)return;if(!value){if(routeId)setRouteError('这件作品未在此浏览器找到。可以从项目备份导入。');return;}api.load(validateProject(value));}).catch(e=>{if(token===loadToken.current&&routeId)setRouteError(e instanceof Error?e.message:'作品读取失败');}).finally(()=>{if(token===loadToken.current)setLoading(false);});
    return()=>{loadToken.current++;};
  },[routeId,api.load]);
  useEffect(()=>{setMenu(false);},[route]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.target instanceof HTMLElement&&e.target.closest('input,textarea,select,[contenteditable=true]'))return;if(!(e.ctrlKey||e.metaKey))return;if(e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?api.redo():api.undo();}if(e.key.toLowerCase()==='s'){e.preventDefault();void api.saveNow().then(()=>notify('已保存在当前浏览器。')).catch(e=>notify(e.message));}};addEventListener('keydown',key);return()=>removeEventListener('keydown',key);},[api.undo,api.redo,api.saveNow,notify]);
  const save=()=>{void api.saveNow().then(()=>notify('已保存在当前浏览器。')).catch(e=>notify(e.message));};
  const go=async(path:string)=>{await api.saveNow().catch(e=>notify(e.message));if(path==='/gallery')setGalleryTick(n=>n+1);navigate(path);};
  const open=(p:SancaiProject)=>replaceSafely(()=>{api.load(p);navigate(routeFor(p));});
  const start=(t:TemplateId)=>replaceSafely(()=>{const p=createProject(t);api.load(p);navigate(routeFor(p));void api.saveNow().catch(e=>notify(e.message));});
  const copy=(p:SancaiProject)=>replaceSafely(()=>{const next=cloneForEditing(p);api.load(next);navigate(routeFor(next));void api.saveNow().catch(e=>notify(e.message));notify('已保留原作，为你打开独立新作。');});
  const recast=(p:SancaiProject)=>replaceSafely(()=>{const next=recastForEditing(p);api.load(next);navigate(routeFor(next));void api.saveNow().catch(e=>notify(e.message));notify('已保留原作，配色与纹样带入新造型；自由笔触可重新绘制。');});
  const backup=(p:SancaiProject)=>{try{download(projectBlob(p),`${p.title||'我的唐彩'}.sancai.json`);}catch(e){notify(e instanceof Error?e.message:'项目备份失败');}};
  const importFile=async(file:File)=>{setBusy(true);try{const p=await readProjectFile(file);await replaceSafely(()=>{api.load(p);navigate(routeFor(p));void api.saveNow().catch(e=>notify(e.message));notify('已从备份恢复为独立作品。');});}catch(e){notify(e instanceof Error?e.message:'导入失败，原作品未改变。');}finally{setBusy(false);if(input.current)input.current.value='';}};
  const fire=(style:FiringStyle)=>{if(!project)return;api.update(p=>beginFiring(p,style),false);void api.saveNow().catch(e=>notify(e.message));navigate(`/kiln/${project.id}`);};
  const complete=useCallback((id:string)=>{const p=projectRef.current;if(!p||p.phase!=='firing'||p.firing?.id!==id)return;api.update(current=>finishFiring(current,id),false);void api.saveNow().catch(e=>notify(e.message));navigate(`/result/${p.id}`);},[api.update,api.saveNow,notify]);
  const fireAnother = (previous:SancaiProject) => replaceSafely(()=>{
    if (!previous.firing) return;
    const next = cloneForEditing(previous);
    next.title = `${previous.title.slice(0,88)} · 重新烧成`;
    const version = beginFiring(next,previous.firing.style,(previous.firing.seed+0x9e3779b9)>>>0);
    api.load(version);
    void api.saveNow().catch(e=>notify(e.message));
    navigate(routeFor(version));
  });
  const exportPng = async (background?:string, product=false) => {
    if (!project || project.phase!=='finished') return;
    setBusy(true);
    try {
      let image:HTMLCanvasElement;
      if (product) {
        const id=project.activeProduct;
        image=await renderProjectProduct(project,id,project.products[id],1800);
      } else {
        const art=await ensureFiredArtifact(project,2048);
        image=art.canvas;
        if (background) {
          image=canvas(2048);
          const ctx=image.getContext('2d')!;
          ctx.fillStyle=background;
          ctx.fillRect(0,0,2048,2048);
          ctx.drawImage(art.canvas,0,0);
        }
      }
      download(await blobFromCanvas(image),`${project.title||'我的唐彩'}${product?'-布料印花':background?'-背景版':'-透明作品'}.png`);
      notify('图片已准备好，可在浏览器的下载列表查看。');
    } catch(e) {
      notify(e instanceof Error?e.message:'导出失败，请重试。');
    } finally { setBusy(false); }
  };
  const updatePlacement = (placement:Placement) => {
    if (!project) return;
    const id=project.activeProduct;
    const next={...project,products:{...project.products,[id]:placement}};
    if (placement.companion && placement.companion!==project.products[id].companion) {
      try { projectBlob(next); } catch(e) {
        notify(e instanceof Error?e.message:'无法添加此作品。');
        return;
      }
    }
    api.update(p=>({...p,products:{...p.products,[id]:placement}}),false);
  };
  const exportSvg = (p:SancaiProject) => {
    try { download(vectorDesign(p),`${p.title||'我的唐彩'}-设计稿.svg`); }
    catch(e) { notify(e instanceof Error?e.message:'导出 SVG 失败。'); }
  };
  const active=project&&(!routeId||project.id===routeId)?project:null;
  const needsProject=['studio','kiln','result','fabric'].includes(page);
  let content;
  if(needsProject&&(loading||(!active&&!routeError)))content=<main className="page-shell loading-page"><span className="loading-seal">釉</span><p>正在打开作品…</p></main>;
  else if(needsProject&&(!active||routeError))content=<main className="page-shell empty-state"><h1>暂时没有打开这件作品</h1><p role="alert">{routeError}</p><div className="button-row"><button className="button secondary" onClick={()=>input.current?.click()}>导入项目备份</button><button className="button primary" onClick={()=>go('/gallery')}>查看我的作品</button></div></main>;
  else if(page==='choose')content=<ChoosePage start={start}/>;
  else if(page==='explore')content=<ExplorePage start={start}/>;
  else if(page==='gallery')content=<GalleryPage refresh={galleryTick} open={open} remove={async id=>{try{await deleteProject(id);if(project?.id===id)api.clear();notify('作品已从此浏览器移除。');}catch(e){notify(e instanceof Error?e.message:'删除失败');throw e;}}} copy={copy} backup={backup} importFile={()=>input.current?.click()} start={()=>go('/choose')}/>;
  else if(active&&(page==='studio'||page==='kiln'||page==='result'||page==='fabric')){
    if(active.phase==='finished')content=page==='fabric'?<FabricPage key={active.id} project={active} busy={busy} select={id=>api.update(p=>({...p,activeProduct:id}),false)} place={updatePlacement} download={()=>void exportPng(undefined,true)} back={()=>go(`/result/${active.id}`)}/>:<ResultPage key={active.id} project={active} busy={busy} rename={title=>api.update(p=>({...p,title}),false)} save={save} download={bg=>void exportPng(bg)} svg={()=>exportSvg(active)} refire={()=>void fireAnother(active)} backup={()=>backup(active)} copy={()=>copy(active)} recast={()=>void recast(active)} fabric={()=>go(`/fabric/${active.id}`)}/>;
    else if(active.phase==='firing')content=<KilnPage key={active.firing?.id} project={active} complete={complete} cancel={()=>{api.update(cancelFiring,false);void api.saveNow().catch(e=>notify(e.message));navigate(`/studio/${active.id}`);}}/>;
    else content=<StudioPage key={active.id} project={active} edit={api.editDesign} prepare={()=>api.update(p=>({...p,phase:'glazing',preparationSeen:true}),false)} fire={fire} notify={notify} recast={()=>void recast(active)}/>;
  } else content=<HomePage demo={demo} project={project} start={()=>go('/choose')} resume={()=>project&&go(routeFor(project))} explore={()=>go('/explore')}/>;

  content=<>{project&&(api.status.includes('失败')||api.status.includes('冲突'))&&<aside className="storage-warning" aria-label="作品保存提醒"><p role="alert">{api.status} 当前设计仍在页面中，请下载备份。</p><div><button className="text-button" onClick={()=>backup(project)}>下载当前项目备份</button><button className="text-button" onClick={save}>重试保存</button></div></aside>}{content}{replacement&&<Dialog title="当前作品尚未保存" close={()=>setReplacement(null)}><p>{replacement.error}</p><p>切换前可先下载当前项目备份，或返回继续创作。继续切换会离开这份未保存的设计。</p><div className="dialog-actions">{project&&<button className="button secondary" onClick={()=>backup(project)}>下载当前项目备份</button>}<button className="button secondary" onClick={()=>setReplacement(null)}>返回当前作品</button><button className="button primary" onClick={()=>{const run=replacement.run;setReplacement(null);run();}}>继续切换（未保存）</button></div></Dialog>}</>;

  return <><header className="site-header"><div className="header-inner"><button className="brand" onClick={()=>go('/')} aria-label="釉见唐彩 首页"><span className="brand-mark">釉</span><span>釉见唐彩<small>TANG SANCAI STUDIO</small></span></button><nav aria-label="主导航" className={menu?'nav-open':''}><button className={page==='explore'?'active':''} onClick={()=>go('/explore')}>认识唐彩</button><button className={['studio','choose','kiln'].includes(page)?'active':''} onClick={()=>go(project&&project.phase!=='finished'?routeFor(project):'/choose')}>创作工坊</button><button className={page==='gallery'?'active':''} onClick={()=>go('/gallery')}>我的作品</button></nav><div className="header-actions">{needsProject&&active&&<><span className={`save-status ${api.status.includes('失败')||api.status.includes('冲突')?'save-error':''}`} aria-live="polite"><i/>{api.status}</span>{(active.phase==='glazing'||active.phase==='preparation')&&<div className="undo-buttons"><button className="icon-button" aria-label="撤销" title="撤销 Ctrl+Z" disabled={!api.canUndo} onClick={api.undo}><Undo2 size={18}/></button><button className="icon-button" aria-label="重做" title="重做 Ctrl+Shift+Z" disabled={!api.canRedo} onClick={api.redo}><Redo2 size={18}/></button></div>}<button className="icon-button" title="下载项目备份" aria-label="下载项目备份" onClick={()=>backup(active)}><Download size={18}/></button><button className="icon-button" title="立即保存" aria-label="立即保存" onClick={save}><Save size={18}/></button></>}<button className="menu-button icon-button" aria-expanded={menu} aria-label="切换导航菜单" onClick={()=>setMenu(!menu)}>{menu?<X size={21}/>:<Menu size={21}/>}</button>{!needsProject&&<button className="button header-create" onClick={()=>go('/choose')}>开始创作<ArrowLeft className="arrow-turn" size={16}/></button>}</div></div></header>{content}<footer className="site-footer"><div><span className="footer-brand">釉见唐彩</span></div><p>唐三彩题材的当代数字创作 · 作品保存在当前浏览器</p><a href="https://www.ihchina.cn/ccr_detail/14450/" target="_blank" rel="noreferrer">工艺资料来源 ↗</a></footer><input ref={input} type="file" accept=".json,.sancai.json,application/json" className="sr-only" tabIndex={-1} aria-label="导入唐彩项目" onChange={e=>{const file=e.target.files?.[0];if(file)void importFile(file);}}/>{message&&<div className="toast" role="status"><Check size={18}/><span>{message}</span><button className="icon-button" aria-label="关闭提示" onClick={()=>setMessage('')}><X size={16}/></button></div>}</>;
}
