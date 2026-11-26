import { useCallback, useEffect, useRef, useState } from 'react';
import { ACTIVE_PROJECT_KEY, nextTimestamp } from '../domain/project';
import type { DesignSnapshot, SancaiProject } from '../domain/types';
import { rememberProjectVersion, saveProject } from '../persistence/database';

function active(id: string | null) {
  try { if (id) localStorage.setItem(ACTIVE_PROJECT_KEY, id); else localStorage.removeItem(ACTIVE_PROJECT_KEY); }
  catch { /* IndexedDB and downloadable backups remain available. */ }
}

export function useProject() {
  const [project, setProject] = useState<SancaiProject | null>(null);
  const projectRef = useRef<SancaiProject | null>(null);
  const [status, setStatus] = useState('尚未保存');
  const [historyTick, tick] = useState(0);
  const past = useRef<SancaiProject[]>([]), future = useRef<SancaiProject[]>([]);
  const mounted = useRef(true);
  const commit = useCallback((next: SancaiProject | null) => {
    projectRef.current = next; setProject(next); tick(n => n + 1);
  }, []);
  const load = useCallback((value: SancaiProject) => {
    const snapshot = structuredClone(value);
    past.current = []; future.current = [];
    rememberProjectVersion(snapshot); active(snapshot.id);
    setStatus('保存中'); commit(snapshot);
  }, [commit]);
  const clear = useCallback(() => {
    past.current = []; future.current = []; active(null); commit(null); setStatus('尚未保存');
  }, [commit]);
  const update = useCallback((fn: (value: SancaiProject) => SancaiProject, historical = true) => {
    const previous = projectRef.current;
    if (!previous) return;
    const draft = structuredClone(previous), result = fn(draft);
    if (result.id !== previous.id) throw new Error('新作品请通过 load 打开，不能覆盖当前作品 ID。');
    if (JSON.stringify(result) === JSON.stringify(previous)) return;
    const next = { ...result, updatedAt: nextTimestamp(previous.updatedAt) };
    if (historical) { past.current.push(previous); if (past.current.length > 30) past.current.shift(); future.current = []; }
    commit(next);
  }, [commit]);
  const editDesign = useCallback((fn: (design: DesignSnapshot) => DesignSnapshot) => {
    update(value => {
      if (value.phase === 'finished' || value.phase === 'firing') throw new Error('请复制成品为新作后修改釉色。');
      const next = fn(value.design);
      return { ...value, design: next, designRevision: value.designRevision + 1, firing: undefined };
    });
  }, [update]);
  const undo = useCallback(() => {
    const previous = projectRef.current;
    if (!previous || (previous.phase !== 'glazing' && previous.phase !== 'preparation')) return;
    const old = past.current.pop(); if (!old) return;
    future.current.push(previous); commit({ ...old, updatedAt: nextTimestamp(previous.updatedAt) });
  }, [commit]);
  const redo = useCallback(() => {
    const previous = projectRef.current;
    if (!previous || (previous.phase !== 'glazing' && previous.phase !== 'preparation')) return;
    const next = future.current.pop(); if (!next) return;
    past.current.push(previous); commit({ ...next, updatedAt: nextTimestamp(previous.updatedAt) });
  }, [commit]);
  const saveNow = useCallback(async () => {
    const snapshot = projectRef.current;
    if (!snapshot) return;
    if (mounted.current) setStatus('保存中');
    try {
      await saveProject(snapshot);
      if (mounted.current && projectRef.current?.id === snapshot.id && projectRef.current.updatedAt === snapshot.updatedAt) setStatus('已保存在此浏览器');
    } catch (error) {
      const message = error instanceof Error ? error.message : '请下载项目备份后重试。';
      if (mounted.current && projectRef.current?.id === snapshot.id) setStatus(message.includes('冲突') ? message : `保存失败：${message}`);
      throw error;
    }
  }, []);
  useEffect(() => {
    if (!project) return;
    setStatus('保存中');
    const timer = window.setTimeout(() => { void saveNow().catch(() => undefined); }, 750);
    return () => window.clearTimeout(timer);
  }, [project, saveNow]);
  useEffect(() => {
    mounted.current = true;
    const persist = () => { void saveNow().catch(() => undefined); };
    const visibility = () => { if (document.visibilityState === 'hidden') persist(); };
    window.addEventListener('pagehide', persist);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      mounted.current = false;
      window.removeEventListener('pagehide', persist);
      document.removeEventListener('visibilitychange', visibility);
      persist();
    };
  }, [saveNow]);
  const editable = !!project && (project.phase === 'glazing' || project.phase === 'preparation');
  return { project, load, clear, update, editDesign, undo, redo, status, saveNow,
    canUndo: historyTick >= 0 && editable && past.current.length > 0,
    canRedo: historyTick >= 0 && editable && future.current.length > 0 };
}
