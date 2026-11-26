import { getTemplate, TEMPLATES } from './templates';
import { hashDesign } from './project';
import type { BrushStroke, DesignSnapshot, FiringSnapshot, GlazeChoice, GlazeId, PatternSpec, Placement, RegionDesign, SancaiProject, TemplateId } from './types';

export const PROJECT_FILE_LIMIT = 5 * 1024 * 1024;
export const MAX_STROKES = 200;
export const MAX_STROKE_POINTS = 256;
export const MAX_TOTAL_POINTS = 50000;
const GLAZES: GlazeId[] = ['amber', 'ochre', 'leafGreen', 'jadeGreen', 'cream', 'cobalt', 'warmBrown'];
type Obj = Record<string, unknown>;
function fail(message = '项目文件格式不正确，或包含不支持的版本。'): never { throw new Error(message); }
function object(value: unknown): Obj {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail();
  return value as Obj;
}
function text(value: unknown, max = 100, allowEmpty = false): string {
  if (typeof value !== 'string' || value.length > max || (!allowEmpty && !value.trim()) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) fail();
  return value;
}
function number(value: unknown, low: number, high: number, integer = false): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < low || value > high || (integer && !Number.isInteger(value))) fail();
  return value;
}
function choice<T extends string>(value: unknown, values: readonly T[]): T {
  if (typeof value !== 'string' || !values.includes(value as T)) fail();
  return value as T;
}
function date(value: unknown): string {
  const str = text(value, 40);
  if (!Number.isFinite(Date.parse(str))) fail();
  return new Date(str).toISOString();
}
function pattern(value: unknown): PatternSpec | undefined {
  if (value === undefined) return undefined;
  const p = object(value);
  if (!Array.isArray(p.colors) || p.colors.length < 1 || p.colors.length > 3) fail();
  return {
    kind: choice(p.kind, ['dots', 'diamonds', 'ribbons']),
    colors: p.colors.map(c => choice(c, GLAZES)), size: number(p.size, 8, 300),
    density: number(p.density, .05, 1), rotation: number(p.rotation, -180, 180), seed: number(p.seed, 0, 0xffffffff, true),
  };
}
function design(value: unknown): DesignSnapshot {
  const d = object(value);
  const templateId = choice<TemplateId>(d.templateId, TEMPLATES.map(t => t.id));
  if (d.templateVersion !== 1 && d.templateVersion !== 2 && d.templateVersion !== 3 && d.templateVersion !== 4 && d.templateVersion !== 5) fail('此模板版本暂不支持，请保留原项目文件。');
  const template = getTemplate(templateId, d.templateVersion), expected = template.regions.filter(r => r.editable).map(r => r.id);
  const rawRegions = object(d.regions), keys = Object.keys(rawRegions);
  if (keys.length !== expected.length || keys.some(id => !expected.includes(id))) fail('作品包含未知或缺失的涂色区域。');
  const regions: Record<string, RegionDesign> = {};
  for (const id of expected) {
    const r = object(rawRegions[id]);
    const spec = pattern(r.pattern);
    regions[id] = { baseGlaze: choice<GlazeChoice>(r.baseGlaze, [...GLAZES, 'unglazed']), amount: choice(r.amount, ['thin', 'medium', 'thick']), ...(spec ? { pattern: spec } : {}) };
  }
  if (!Array.isArray(d.strokes) || d.strokes.length > MAX_STROKES) fail('笔触数量超过项目上限。');
  let pointCount = 0;
  const ids = new Set<string>();
  const strokes: BrushStroke[] = d.strokes.map(raw => {
    const s = object(raw), id = text(s.id), regionId = text(s.regionId);
    if (ids.has(id) || !expected.includes(regionId)) fail('笔触包含重复 ID 或未知区域。');
    ids.add(id);
    if (!Array.isArray(s.points) || !s.points.length || s.points.length > MAX_STROKE_POINTS) fail('笔触点数不正确。');
    pointCount += s.points.length;
    return {
      id, regionId, glaze: choice(s.glaze, GLAZES), radius: number(s.radius, 1, 100),
      points: s.points.map(rawPoint => {
        if (!Array.isArray(rawPoint) || rawPoint.length !== 2) fail();
        return [number(rawPoint[0], 0, 1024), number(rawPoint[1], 0, 1024)] as [number, number];
      }),
    };
  });
  if (pointCount > MAX_TOTAL_POINTS) fail('项目笔触总点数过多。');
  const expression = d.expression === undefined ? undefined : choice(d.expression, ['smile', 'alert']);
  if (expression && !template.expressions?.[expression]) fail('此素坯不支持文件中的表情。');
  return { templateId, templateVersion: d.templateVersion, regions, strokes, seed: number(d.seed, 0, 0xffffffff, true), ...(expression ? {expression} : {}) };
}
function placement(value: unknown): Placement {
  const p = object(value), color = text(p.color, 7);
  if (!/^#[0-9a-f]{6}$/i.test(color)) fail();
  const layout = p.layout === undefined ? undefined : choice(p.layout, ['single', 'repeat', 'pair']);
  if (layout === 'pair' && p.companion === undefined) fail('拼贴缺少第二件作品。');
  const companion = p.companion === undefined ? undefined : object(p.companion);
  return {
    x: number(p.x, 0, 1), y: number(p.y, 0, 1), scale: number(p.scale, .1, 1.2), rotation: number(p.rotation, -180, 180), color,
    ...(layout ? {layout} : {}),
    ...(companion ? {companion:{
      title: text(companion.title, 100, true),
      design: design(companion.design),
      style: choice(companion.style, ['defined', 'soft', 'flowing']),
      seed: number(companion.seed, 0, 0xffffffff, true),
    }} : {}),
  };
}

export function validateProject(value: unknown): SancaiProject {
  const p = object(value);
  if (p.kind !== 'sancai-project') fail('请选择 .sancai.json 唐彩项目；草木入布文件不能作为唐彩作品导入。');
  if (p.schemaVersion !== 1 || p.rendererVersion !== '1') fail('此项目或渲染版本暂不支持，请保留原文件。');
  const phase = choice(p.phase, ['preparation', 'glazing', 'firing', 'finished']);
  const current = design(p.design), revision = number(p.designRevision, 0, 1e7, true);
  if (typeof p.preparationSeen !== 'boolean') fail();
  if (phase !== 'preparation' && !p.preparationSeen) fail('项目工艺阶段不一致。');
  let firing: FiringSnapshot | undefined;
  if (p.firing !== undefined) {
    const f = object(p.firing), frozen = design(f.design);
    if (f.rendererVersion !== '1') fail('烧成记录使用了不支持的渲染版本。');
    const hash = text(f.designHash, 8), fromRevision = number(f.designRevision, 0, 1e7, true);
    if (hash !== hashDesign(frozen) || hash !== hashDesign(current) || fromRevision !== revision) fail('烧成快照与当前设计不一致，无法恢复为同一成品。');
    firing = {
      id: text(f.id), designRevision: fromRevision, designHash: hash, design: frozen, rendererVersion: '1',
      style: choice(f.style, ['defined', 'soft', 'flowing']), seed: number(f.seed, 0, 0xffffffff, true),
      status: choice(f.status, ['queued', 'rendering', 'ready']), startedAt: date(f.startedAt),
      ...(f.completedAt !== undefined ? { completedAt: date(f.completedAt) } : {}),
    };
  }
  if (phase === 'finished' && (!firing || firing.status !== 'ready' || !firing.completedAt)) fail('作品尚没有有效的烧成记录。');
  if (phase === 'firing' && (!firing || firing.status === 'ready')) fail('烧制阶段与任务状态不一致。');
  if ((phase === 'preparation' || phase === 'glazing') && firing) fail('未烧制项目不应带有旧成品记录。');
  const products = object(p.products);
  const createdAt = date(p.createdAt), updatedAt = date(p.updatedAt);
  if (updatedAt < createdAt) fail('项目时间记录不正确。');
  return {
    kind: 'sancai-project', schemaVersion: 1, rendererVersion: '1', id: text(p.id),
    ...(p.parentProjectId !== undefined ? { parentProjectId: text(p.parentProjectId) } : {}),
    title: text(p.title, 100, true), createdAt, updatedAt, phase,
    preparationSeen: p.preparationSeen, designRevision: revision, design: current, ...(firing ? { firing } : {}),
    products: { tote: placement(products.tote), shirt: placement(products.shirt), handkerchief: placement(products.handkerchief) },
    activeProduct: choice(p.activeProduct, ['tote', 'shirt', 'handkerchief']),
  };
}
