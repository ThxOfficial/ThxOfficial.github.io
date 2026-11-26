import { applyPalette } from './palettes';
import { beginFiring, createProject, finishFiring } from './project';
import type { TemplateId } from './types';

export function createExample(id:TemplateId, seed=34815) {
  let project = createProject(id);
  project.phase = 'glazing';
  project.preparationSeen = true;
  project.design.seed = seed;
  project.design = applyPalette(project.design, id === 'official' ? 'greenRobe' : 'classic');
  project = beginFiring(project, 'soft');
  return finishFiring(project, project.firing!.id);
}
