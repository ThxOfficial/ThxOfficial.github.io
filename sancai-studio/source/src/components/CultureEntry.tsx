import { ExternalLink } from 'lucide-react';
import type { CultureEntry as Entry, PhotoSlot } from '../content/objects';
import CulturePhoto from './CulturePhoto';

export default function CultureEntry({entry, slot, showPhoto = false}:{
  entry: Entry;
  slot: PhotoSlot;
  showPhoto?: boolean;
}) {
  const photo = <CulturePhoto slot={slot} label={entry.title} credit={entry.photoCredit}/>;
  return <section className="culture-entry">
    {showPhoto && photo}
    <div>
      <h2>{entry.title}</h2>
      <p>{entry.summary}</p>
      <details>
        <summary>了解{entry.title.endsWith('？') ? '唐三彩' : entry.title}</summary>
        <p>{entry.body}</p>
        {!showPhoto && photo}
        <a href={entry.source} target="_blank" rel="noreferrer">{entry.sourceTitle}<ExternalLink size={14}/></a>
      </details>
    </div>
  </section>;
}
