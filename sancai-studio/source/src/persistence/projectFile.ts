import { nextTimestamp } from '../domain/project';
import { PROJECT_FILE_LIMIT, validateProject } from '../domain/validation';
import type { SancaiProject } from '../domain/types';

export async function readProjectFile(file: File): Promise<SancaiProject> {
  if (file.size > PROJECT_FILE_LIMIT) throw new Error('项目文件超过 5MB，请选择有效的 .sancai.json 文件。');
  let raw: unknown;
  try { raw = JSON.parse(await file.text()); }
  catch { throw new Error('无法读取项目文件，请选择有效的 .sancai.json 文件。'); }
  const project = validateProject(raw), now = nextTimestamp();
  return { ...project, id: crypto.randomUUID(), parentProjectId: project.id, createdAt: now, updatedAt: now };
}
export function projectBlob(project: SancaiProject): Blob {
  const blob = new Blob([JSON.stringify(validateProject(project))], { type: 'application/json;charset=utf-8' });
  if (blob.size > PROJECT_FILE_LIMIT) throw new Error('这份设计的项目备份超过 5 MB。可以减少拼贴作品或笔触后再下载。');
  return blob;
}
