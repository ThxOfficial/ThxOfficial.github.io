import { ImageIcon } from 'lucide-react';
import type { PhotoSlot } from '../content/objects';

const files = import.meta.glob<string>('../assets/photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: '?url',
});
const photos = new Map(Object.entries(files).map(([path, url]) => [
  path.split('/').at(-1)!.split('.')[0], url,
]));

export default function CulturePhoto({slot, label, credit}:{
  slot: PhotoSlot;
  label: string;
  credit?: string;
}) {
  const photo = photos.get(slot);
  return <figure className="culture-photo">
    {photo
      ? <a href={photo} target="_blank" rel="noreferrer" aria-label={`查看原图：${label}`}>
          <img src={photo} loading="lazy" decoding="async" alt={label}/>
        </a>
      : <div className="culture-photo-placeholder"><ImageIcon size={26} aria-hidden="true"/><span>照片待补充</span></div>}
    <figcaption>{label}{photo && credit && <span> · {credit}</span>}</figcaption>
  </figure>;
}
