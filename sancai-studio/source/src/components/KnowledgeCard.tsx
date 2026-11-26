import { ExternalLink } from 'lucide-react';
import { KNOWLEDGE } from '../content/craft';

export default function KnowledgeCard({id}:{id:string}) {
  const card=KNOWLEDGE.find(k=>k.id===id);
  if(!card)return null;
  return <article className="knowledge-card"><h3>{card.title}</h3><p>{card.summary}</p>
    <details><summary aria-label={`了解更多：${card.title}`}>了解更多</summary><p>{card.body}</p><a href={card.source} target="_blank" rel="noreferrer">{card.sourceTitle}<ExternalLink size={13}/></a></details>
  </article>;
}
