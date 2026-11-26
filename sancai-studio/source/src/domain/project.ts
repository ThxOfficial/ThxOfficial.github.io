import { getTemplate } from './templates';
import type { DesignSnapshot, FiringStyle, SancaiProject, TemplateId } from './types';

export const ACTIVE_PROJECT_KEY = 'sancai-studio:active-project';

export function nextTimestamp(previous?: string): string {
  return new Date(Math.max(Date.now(), (previous ? Date.parse(previous) : 0) + 1)).toISOString();
}

// Canonical, stable data hash for cache identity, not a cryptographic signature.
export function hashDesign(design: DesignSnapshot): string {
  const canonical = JSON.stringify({
    templateId: design.templateId, templateVersion: design.templateVersion, seed: design.seed,
    expression: design.expression,
    regions: Object.fromEntries(Object.keys(design.regions).sort().map(id => {
      const r = design.regions[id];
      return [id, { baseGlaze: r.baseGlaze, amount: r.amount, pattern: r.pattern ? {
        kind: r.pattern.kind, colors: r.pattern.colors, size: r.pattern.size,
        density: r.pattern.density, rotation: r.pattern.rotation, seed: r.pattern.seed,
      } : undefined }];
    })),
    strokes: design.strokes.map(s => ({ id: s.id, regionId: s.regionId, glaze: s.glaze, radius: s.radius, points: s.points })),
  });
  let hash = 2166136261;
  for (let i = 0; i < canonical.length; i++) hash = Math.imul(hash ^ canonical.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function randomSeed() {
  return crypto.getRandomValues(new Uint32Array(1))[0];
}

export function createProject(templateId: TemplateId = 'horse'): SancaiProject {
  const template = getTemplate(templateId), now = new Date().toISOString();
  return {
    kind: 'sancai-project', schemaVersion: 1, rendererVersion: '1', id: crypto.randomUUID(),
    title: `我的${template.name}`, createdAt: now, updatedAt: now, phase: 'preparation',
    preparationSeen: false, designRevision: 0,
    design: {
      templateId, templateVersion: template.version, seed: randomSeed(), strokes: [],
      regions: Object.fromEntries(template.regions.filter(r => r.editable).map(r => [r.id, { baseGlaze: 'unglazed' as const, amount: 'medium' as const }])),
    },
    products: {
      tote: { x: .5, y: .65, scale: .43, rotation: 0, color: '#ffffff' },
      shirt: { x: .5, y: .51, scale: .38, rotation: 0, color: '#ffffff' },
      handkerchief: { x: .5, y: .53, scale: .75, rotation: 0, color: '#ffffff' },
    }, activeProduct: 'tote',
  };
}

export function cloneForEditing(project: SancaiProject): SancaiProject {
  const copy = structuredClone(project), now = new Date().toISOString();
  copy.parentProjectId = project.id;
  copy.id = crypto.randomUUID();
  copy.title = `${project.title.slice(0, 90)} · 新作`;
  copy.createdAt = copy.updatedAt = now;
  copy.phase = 'glazing'; copy.preparationSeen = true;
  delete copy.firing;
  return copy;
}

export function recastForEditing(project:SancaiProject):SancaiProject {
  const next=cloneForEditing(project),current=getTemplate(project.design.templateId);
  next.title=`${project.title.slice(0,85)} · 新造型`;
  next.design.templateVersion=current.version;
  next.design.regions=Object.fromEntries(current.regions.filter(r=>r.editable).map(r=>[r.id,structuredClone(project.design.regions[r.id]||{baseGlaze:'unglazed',amount:'medium'})]));
  // Coordinates in a different silhouette are not transferable brush marks.
  next.design.strokes=[];next.designRevision=0;
  return next;
}

export function beginFiring(project: SancaiProject, style: FiringStyle, seed = (project.design.seed ^ 0x9e3779b9) >>> 0): SancaiProject {
  if (project.phase !== 'glazing') throw new Error('请先完成素坯准备并进入涂釉。');
  const design = structuredClone(project.design), now = nextTimestamp(project.updatedAt);
  return {
    ...project, phase: 'firing', updatedAt: now,
    firing: {
      id: crypto.randomUUID(), designRevision: project.designRevision, designHash: hashDesign(design),
      design, rendererVersion: '1', style, seed,
      status: 'rendering', startedAt: now,
    },
  };
}

export function finishFiring(project: SancaiProject, firingId: string): SancaiProject {
  const firing = project.firing;
  // A cancelled or superseded task can never commit to a newer design.
  if (project.phase !== 'firing' || !firing || firing.id !== firingId ||
      firing.designRevision !== project.designRevision || firing.designHash !== hashDesign(project.design)) return project;
  const now = nextTimestamp(project.updatedAt);
  return { ...project, phase: 'finished', updatedAt: now, firing: { ...firing, status: 'ready', completedAt: now } };
}

export function cancelFiring(project: SancaiProject): SancaiProject {
  if (project.phase !== 'firing') return project;
  const next = { ...project, phase: 'glazing' as const, updatedAt: nextTimestamp(project.updatedAt) };
  delete next.firing;
  return next;
}
