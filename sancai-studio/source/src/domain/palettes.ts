import type { DesignSnapshot, GlazeChoice, GlazeId, PatternSpec } from './types';
import { getTemplate } from './templates';
export const GLAZE_HEX: Record<GlazeId, string> = {
  amber: '#C58A2E', ochre: '#8B4E2B', leafGreen: '#5F7C35', jadeGreen: '#2F6A50',
  cream: '#F2E5C6', cobalt: '#2D607F', warmBrown: '#503B2F',
};
export const GLAZES: { id: GlazeChoice; name: string; color: string }[] = [
  { id: 'amber', name: '琥珀黄', color: GLAZE_HEX.amber },
  { id: 'leafGreen', name: '橄榄绿', color: GLAZE_HEX.leafGreen },
  { id: 'cream', name: '奶白釉', color: GLAZE_HEX.cream },
  { id: 'ochre', name: '赭褐', color: GLAZE_HEX.ochre },
  { id: 'jadeGreen', name: '深翠绿', color: GLAZE_HEX.jadeGreen },
  { id: 'cobalt', name: '钴蓝意向', color: GLAZE_HEX.cobalt },
  { id: 'warmBrown', name: '深棕', color: GLAZE_HEX.warmBrown },
  { id: 'unglazed', name: '保留素胎', color: '#E9DDC5' },
];
export const PALETTES: { id: string; name: string; note: string; colors: GlazeId[] }[] = [
  { id: 'classic', name: '黄绿相间', note: '温润琥珀，翠色相伴', colors: ['amber', 'leafGreen', 'cream'] },
  { id: 'amberWhite', name: '琥珀留白', note: '浅浅点彩，留一点呼吸', colors: ['ochre', 'cream', 'warmBrown'] },
  { id: 'greenRobe', name: '绿袍点彩', note: '一抹翠绿，几处素白', colors: ['jadeGreen', 'cream', 'ochre'] },
  { id: 'blueAccent', name: '蓝釉点彩', note: '深蓝之上，开出浅色斑点', colors: ['cobalt', 'cream', 'amber'] },
  { id: 'creamJade', name: '素白翠饰', note: '素胎为底，翠色为饰', colors: ['cream', 'jadeGreen', 'amber'] },
  { id: 'brocade', name: '锦色菱格', note: '把一片斑斓织在鞍毯上', colors: ['amber', 'leafGreen', 'cobalt', 'cream'] },
];
export function applyPalette(design: DesignSnapshot, paletteId: string): DesignSnapshot {
  const palette = PALETTES.find(p => p.id === paletteId);
  if (!palette) throw new Error('未知配色起点');
  const next = structuredClone(design), template = getTemplate(design.templateId,design.templateVersion);
  const body = palette.colors[0], accent = palette.colors[1], trim = palette.colors[2];
  const patterned = new Set(['body', 'neck', 'robe', 'chest']);
  const dark = new Set(['mane', 'tail', 'hooves', 'hat', 'boots', 'hats', 'instruments', 'foot']);
  const light = new Set(['ornaments', 'collar', 'innerRobe', 'face', 'hands', 'heads', 'panel']);
  const cloth = new Set(['blanket', 'robe', 'chest', 'skirt', 'leftRobe', 'leadRobe', 'cushion', 'band', 'rim']);
  for (const r of template.regions.filter(r => r.editable)) {
    let color: GlazeChoice = body;
    if (dark.has(r.id)) color = paletteId === 'creamJade' ? 'jadeGreen' : 'ochre';
    if (['saddle', 'bridle', 'belt', 'helmet', 'shoulders'].includes(r.id)) color = trim;
    if (cloth.has(r.id)) color = paletteId === 'blueAccent' ? 'amber' : accent;
    if (light.has(r.id)) color = 'cream';
    if (paletteId === 'classic' && r.id === 'neck') color = 'cream';
    if (paletteId === 'amberWhite' && (r.id === 'body' || r.id === 'neck')) color = 'amber';
    if (paletteId === 'creamJade' && !dark.has(r.id) && !cloth.has(r.id) && !light.has(r.id)) color = 'unglazed';
    let pattern: PatternSpec | undefined;
    const spec = (kind: PatternSpec['kind'], colors: GlazeId[], size: number, density: number): PatternSpec => ({ kind, colors, size, density, rotation: 0, seed: (next.seed + r.zIndex * 911) >>> 0 });
    if (['amberWhite', 'blueAccent', 'greenRobe'].includes(paletteId) && patterned.has(r.id)) pattern = spec('dots', ['cream'], 25, .43);
    if (paletteId === 'classic' && r.id === 'blanket') pattern = spec('dots', ['cream'], 22, .32);
    if (paletteId === 'brocade' && (cloth.has(r.id) || r.id === 'saddle')) pattern = spec('diamonds', ['cream', 'amber', 'cobalt'], 58, .8);
    next.regions[r.id] = { baseGlaze: color, amount: 'medium', ...(pattern ? { pattern } : {}) };
  }
  next.strokes = [];
  return next;
}
