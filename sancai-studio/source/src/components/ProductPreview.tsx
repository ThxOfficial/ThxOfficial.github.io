import { useEffect, useRef, useState } from 'react';
import type { Placement, ProductId, SancaiProject } from '../domain/types';
import { renderProjectProduct } from '../rendering/product';

export default function ProductPreview({ project, product, change }: { project: SancaiProject; product: ProductId; change?: (value: Placement) => void }) {
  const ref = useRef<HTMLCanvasElement>(null), token = useRef(0);
  const drag = useRef<{ pointerId: number; x: number; y: number; placement: Placement; draft: Placement } | null>(null);
  const [draft, setDraft] = useState<Placement | null>(null), [error, setError] = useState(''),[attempt,retry]=useState(0),[busy,setBusy]=useState(true);
  useEffect(() => { drag.current = null; setDraft(null); }, [project.id, product, project.products[product]]);
  useEffect(() => {
    const current = ++token.current; setError('');setBusy(true);
    if (ref.current) ref.current.dataset.rendered = 'false';
    renderProjectProduct(project, product, draft || project.products[product], 700).then(image => {
      if (current !== token.current || !ref.current) return;
      const ctx = ref.current.getContext('2d')!; ctx.clearRect(0, 0, 700, 778); ctx.drawImage(image, 0, 0);
      ref.current.dataset.rendered = 'true';
      setBusy(false);
    }).catch(error => { if (current === token.current){setError(error instanceof Error ? error.message : '预览生成失败，请重试');setBusy(false);} });
    return () => { token.current++; };
  }, [project, product, draft,attempt]);
  const end = () => {
    const stroke = drag.current; if (!stroke) return;
    drag.current = null; change?.(stroke.draft); setDraft(null);
  };
  return <div className="product-frame" aria-busy={busy}>
    <canvas ref={ref} width={700} height={778} aria-label="唐三彩布料应用预览" data-testid="product-canvas"
      style={{ cursor: change ? 'grab' : 'default', touchAction: change ? 'none' : 'auto' }}
      onPointerDown={event => {
        if (!change) return;
        const placement = { ...project.products[product] };
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, placement, draft: placement };
      }}
      onPointerMove={event => {
        const start = drag.current; if (!start || start.pointerId !== event.pointerId) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const value = { ...start.placement, x: Math.max(0, Math.min(1, start.placement.x + (event.clientX - start.x) / bounds.width)), y: Math.max(0, Math.min(1, start.placement.y + (event.clientY - start.y) / bounds.height)) };
        start.draft = value; setDraft(value);
      }} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} />
    {error && <div className="preview-error"><p role="alert">{error}</p><button className="button secondary" onClick={()=>retry(n=>n+1)}>重试产品预览</button></div>}
  </div>;
}
