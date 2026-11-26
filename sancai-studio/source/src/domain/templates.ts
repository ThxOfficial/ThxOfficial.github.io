import type { Expression, SancaiTemplate, TemplateId, TemplateVersion } from './types';
import { horse } from '../templates/horse';
import { camel } from '../templates/camel';
import { official } from '../templates/official';
import { guardian } from '../templates/guardian';
import { horseV2 } from '../templates/horse-v2';
import { camelV2 } from '../templates/camel-v2';
import { officialV2 } from '../templates/official-v2';
import { guardianV2 } from '../templates/guardian-v2';
import { horseV3 } from '../templates/horse-v3';
import { camelV3 } from '../templates/camel-v3';
import { officialV3 } from '../templates/official-v3';
import { guardianV3 } from '../templates/guardian-v3';
import { horseV4 } from '../templates/horse-v4';
import { horseV5 } from '../templates/horse-v5';
import { vessel } from '../templates/vessel';
import { musicians } from '../templates/musicians';
export const TEMPLATES: SancaiTemplate[] = [horseV5, camelV3, officialV3, guardianV3, vessel, musicians];
const ALL_TEMPLATES = [...TEMPLATES, horseV4, horseV3, horseV2, camelV2, officialV2, guardianV2, horse, camel, official, guardian];
export function getTemplate(id: TemplateId, version?: TemplateVersion): SancaiTemplate {
  const template = (version === undefined ? TEMPLATES : ALL_TEMPLATES).find(t => t.id === id && (version === undefined || t.version === version));
  if (!template) throw new Error('暂不支持这个素坯，请选择已提供的形象。');
  return template;
}

export function detailPathsFor(template:SancaiTemplate, expression?:Expression) {
  const alternate = expression && template.expressions?.[expression];
  return alternate ? [...template.detailPaths.filter(d=>!d.facialLine),...alternate] : template.detailPaths;
}
