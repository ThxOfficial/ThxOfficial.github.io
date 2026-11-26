import { ArrowRight, ArrowUpRight, Flame, Palette, Sparkles } from 'lucide-react';
import type { SancaiProject } from '../domain/types';
import Artwork from '../components/Artwork';
import CultureEntry from '../components/CultureEntry';
import { INTRO } from '../content/objects';
export default function HomePage({demo,project,start,resume,explore}:{demo:SancaiProject;project:SancaiProject|null;start:()=>void;resume:()=>void;explore:()=>void}) {
  return <main className="home page-shell">
    <section className="hero"><div className="hero-copy"><p className="eyebrow"><span/>唐三彩创作工坊</p><h1>给唐三彩<br/><span>上个色</span></h1><p className="hero-desc">选一件素坯，给它配色、加花纹，再看看烧成后的效果。完成后可以下载图片，也可以试试印在帆布袋或衣服上。</p><div className="hero-actions"><button className="button primary large" onClick={start}>开始创作<ArrowUpRight size={20}/></button><button className="text-button" onClick={explore}>先认识唐三彩<ArrowRight size={17}/></button></div>{project&&<button className="resume-link" onClick={resume}><span className="live-dot"/>继续「{project.title}」<ArrowRight size={14}/></button>}</div>
      <div className="hero-art"><div className="hero-arch"/><div className="hero-horse"><Artwork project={demo}/></div><div className="hero-caption"><div className="palette-dots"><i style={{background:'#c58a2e'}}/><i style={{background:'#5f7c35'}}/><i style={{background:'#f2e5c6'}}/></div><span>黄绿相间 · 唐彩骏马</span><span>原创数字示例</span></div></div></section>
    <section className="intro-strip"><div><span className="strip-number">01</span><span><strong>挑一件素坯</strong><small>从喜欢的形象出发</small></span><Palette size={24}/></div><div><span className="strip-number">02</span><span><strong>上釉并烧成</strong><small>轻点上色，自由点彩</small></span><Flame size={24}/></div><div><span className="strip-number">03</span><span><strong>保存或下载</strong><small>也可以预览布料印花</small></span><Sparkles size={24}/></div></section>
    <CultureEntry entry={INTRO} slot="overview" showPhoto/>
  </main>;
}
