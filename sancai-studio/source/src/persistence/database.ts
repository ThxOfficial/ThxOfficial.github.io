import { openDB } from 'idb';
import type { SancaiProject } from '../domain/types';
import { validateProject } from '../domain/validation';

export interface SavedProject { project: SancaiProject; thumbnail?: Blob }
export class ProjectConflictError extends Error {
  constructor() { super('保存冲突：此作品已在另一个标签页更新。请先下载当前项目备份，再重新打开作品，或另存为新作。'); this.name = 'ProjectConflictError'; }
}
const db = () => openDB('sancai-studio', 1, { upgrade(database) {
  database.createObjectStore('projects', { keyPath: 'project.id' });
  database.createObjectStore('artifacts', { keyPath: 'key' });
  database.createObjectStore('meta');
} });
const observedVersions = new Map<string, string>();
let writes: Promise<unknown> = Promise.resolve();
function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const next = writes.then(fn, fn); writes = next.catch(() => undefined); return next;
}
export function rememberProjectVersion(project: SancaiProject) {
  observedVersions.set(project.id, project.updatedAt);
}
export function saveProject(project: SancaiProject, thumbnail?: Blob): Promise<void> {
  const snapshot = structuredClone(project);
  return enqueue(async () => {
    const database = await db();
    try {
      // This transaction makes the version check and write atomic across tabs.
      const tx = database.transaction(['projects', 'meta'], 'readwrite');
      const store = tx.objectStore('projects');
      const [existing, deleted] = await Promise.all([
        store.get(snapshot.id) as Promise<SavedProject | undefined>, tx.objectStore('meta').get(`deleted:${snapshot.id}`),
      ]);
      if (deleted) { tx.abort(); await tx.done.catch(() => undefined); throw new Error('此作品已删除，请另存为新作以继续。'); }
      const observed = observedVersions.get(snapshot.id);
      const sameSnapshot = existing && JSON.stringify(existing.project) === JSON.stringify(snapshot);
      if (existing && (existing.project.updatedAt > snapshot.updatedAt ||
          (existing.project.updatedAt !== observed && !sameSnapshot))) {
        tx.abort(); await tx.done.catch(() => undefined); throw new ProjectConflictError();
      }
      await store.put({ project: snapshot, thumbnail: thumbnail ?? existing?.thumbnail });
      await tx.done;
      observedVersions.set(snapshot.id, snapshot.updatedAt);
    } finally { database.close(); }
  });
}
export async function readProject(id: string): Promise<SancaiProject | undefined> {
  const database = await db();
  try {
    const record = await database.get('projects', id) as SavedProject | undefined;
    if (!record) return undefined;
    const project = validateProject(record.project);
    rememberProjectVersion(project); return project;
  } finally { database.close(); }
}
export async function listProjects(): Promise<SavedProject[]> {
  const database = await db();
  try {
    const records = await database.getAll('projects') as SavedProject[];
    return records.map(record => ({ project: validateProject(record.project), thumbnail: record.thumbnail }))
      .sort((a, b) => b.project.updatedAt.localeCompare(a.project.updatedAt));
  } finally { database.close(); }
}
export function deleteProject(id: string): Promise<void> {
  return enqueue(async () => {
    const database = await db();
    try {
      const tx = database.transaction(['projects', 'meta'], 'readwrite');
      await tx.objectStore('projects').delete(id);
      await tx.objectStore('meta').put(new Date().toISOString(), `deleted:${id}`);
      await tx.done; observedVersions.delete(id);
    } finally { database.close(); }
  });
}
export async function readArtifact(key: string): Promise<Blob | undefined> {
  const database = await db();
  try {
    const tx=database.transaction('artifacts','readwrite');
    const record=await tx.store.get(key) as {key:string;blob:Blob;createdAt:string;accessedAt?:string}|undefined;
    if(record)await tx.store.put({...record,accessedAt:new Date().toISOString()});
    await tx.done; return record?.blob;
  }
  finally { database.close(); }
}
export function writeArtifact(key: string, blob: Blob): Promise<void> {
  return enqueue(async () => {
    const database = await db();
    try {
      const tx=database.transaction('artifacts','readwrite'),now=new Date().toISOString();
      await tx.store.put({key,blob,createdAt:now,accessedAt:now});
      const records=await tx.store.getAll() as {key:string;blob:Blob;createdAt:string;accessedAt?:string}[];
      records.sort((a,b)=>(a.accessedAt||a.createdAt).localeCompare(b.accessedAt||b.createdAt));
      let bytes=records.reduce((sum,item)=>sum+item.blob.size,0),count=records.length;
      for(const item of records){if(bytes<=48*1024*1024&&count<=80)break;if(item.key===key)continue;await tx.store.delete(item.key);bytes-=item.blob.size;count--;}
      await tx.done;
    }
    finally { database.close(); }
  });
}
