import { useEffect, useState } from 'react';
import type { SancaiProject } from '../domain/types';
import { ensureFiredArtifact } from '../rendering/artwork';

export function useFiredArtwork(project:SancaiProject) {
  const [state,setState]=useState<'loading'|'ready'|'error'>('loading'),[error,setError]=useState(''),[attempt,retry]=useState(0);
  useEffect(()=>{
    let live=true;setState('loading');setError('');
    ensureFiredArtifact(project,768).then(()=>{if(live)setState('ready');}).catch(e=>{if(live){setState('error');setError(e instanceof Error?e.message:'成品暂时无法恢复，请重试。');}});
    return()=>{live=false;};
  },[project.id,project.firing?.id,project.firing?.designHash,attempt]);
  return {ready:state==='ready',state,error,retry:()=>retry(n=>n+1)};
}
