import type { GlazeId, PatternSpec } from '../domain/types';
import { GLAZES } from '../domain/palettes';
import Range from './Range';

export default function PatternControls({value,change,remove}:{value:PatternSpec;change:(p:PatternSpec)=>void;remove:()=>void}) {
  const colors=GLAZES.filter(g=>g.id!=='unglazed');
  return <div className="pattern-settings"><div className="pattern-color-list">{value.colors.map((color,i)=><div key={i} className="pattern-color-row"><label>纹样颜色 {i+1}<select aria-label={`纹样颜色 ${i+1}`} value={color} onChange={e=>change({...value,colors:value.colors.map((c,j)=>j===i?e.target.value as GlazeId:c)})}>{colors.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></label>{value.colors.length>1&&<button className="text-button" aria-label={`移除纹样颜色 ${i+1}`} onClick={()=>change({...value,colors:value.colors.filter((_,j)=>j!==i)})}>移除</button>}</div>)}</div>
    {value.colors.length<3&&<button className="text-button" onClick={()=>change({...value,colors:[...value.colors,(colors.find(g=>!value.colors.includes(g.id as GlazeId))?.id||'cream') as GlazeId]})}>＋ 添加一种纹样颜色</button>}
    <Range label="纹样大小" value={value.size} min={12} max={100} change={size=>change({...value,size})}/>
    <Range label="疏密" value={value.density} min={.1} max={1} step={.05} change={density=>change({...value,density})}/>
    <Range label="纹样方向" value={value.rotation} min={-180} max={180} suffix="°" change={rotation=>change({...value,rotation})}/>
    {value.kind==='dots'&&<button className="text-button" onClick={()=>change({...value,seed:(value.seed+0x9e3779b9)>>>0})}>换一组点彩位置</button>}
    <button className="text-button" onClick={remove}>移除此处纹样</button>
  </div>;
}
