import type { ArtworkRenderResult, Placement, ProductId, Rect, SancaiProject } from '../domain/types';
import { canvas, drawCloth } from './common';
import { ensureFiredArtifact } from './artwork';
import { hashDesign } from '../domain/project';
export const PRODUCTS: { id: ProductId; name: string }[] = [
  { id: 'tote', name: '帆布袋' },
  { id: 'shirt', name: '棉质 T 恤' },
  { id: 'handkerchief', name: '棉布手帕' },
];
interface Template { width: number; height: number; path: string; background: string; print: [number, number, number, number] }
// Geometry redrawn in caomu-rubu from the user's supplied tote/shirt references.
const TEMPLATES: Record<ProductId, Template> = {
  tote: { width: 485, height: 841, background: '#b8c6c8', path: 'M11 313H118C122 174 159 62 225 54C301 43 350 161 359 313H460V825H11Z M145 313H332C324 193 293 75 235 69C171 55 148 206 145 313Z', print: [23, 327, 425, 483] },
  shirt: { width: 761, height: 872, background: '#ffffff', path: 'M164 158L288 120Q369 166 453 120L576 158L694 288L617 381L576 374V757H160V374L125 382L46 288Z', print: [164, 222, 409, 522] },
  handkerchief: { width: 900, height: 1000, background: '#e9edeb', path: 'M142 225Q444 215 758 225L770 831Q454 846 130 831Z', print: [156, 244, 589, 566] },
};
function fit(template: Template) {
  const scale = Math.min(880 / template.width, 970 / template.height);
  return { scale, x: (900 - template.width * scale) / 2, y: (1000 - template.height * scale) / 2 };
}
export function printArea(id: ProductId): [number, number, number, number] {
  const t = TEMPLATES[id], f = fit(t);
  return [t.print[0] * f.scale + f.x, t.print[1] * f.scale + f.y, t.print[2] * f.scale, t.print[3] * f.scale];
}
export async function renderFabricProduct({ artwork, artworkBounds, companion, product, placement, size }: {
  artwork: CanvasImageSource; artworkBounds: Rect; companion?: ArtworkRenderResult;
  product: ProductId; placement: Placement; size: number;
}) {
  const result = canvas(size, Math.round(size * 1000 / 900)), ctx = result.getContext('2d')!;
  ctx.scale(size / 900, size / 900);
  const template = TEMPLATES[product], f = fit(template), shape = new Path2D();
  shape.addPath(new Path2D(template.path), new DOMMatrix([f.scale, 0, 0, f.scale, f.x, f.y]));
  ctx.fillStyle = template.background; ctx.fillRect(0, 0, 900, 1000);
  ctx.save(); ctx.clip(shape, 'evenodd'); drawCloth(ctx, 900, 1000, placement.color);
  const [x, y, w, h] = printArea(product); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.globalCompositeOperation = 'source-over';
  const centerX = placement.x * 900, centerY = placement.y * 1000;
  const draw = (image:CanvasImageSource, b:Rect, px:number, py:number, width:number, maxHeight=Infinity) => {
    const scale = Math.min(width / b.width, maxHeight / b.height);
    const tw = b.width * scale, th = b.height * scale;
    ctx.save();
    ctx.translate(px,py); ctx.rotate(placement.rotation * Math.PI / 180);
    ctx.drawImage(image,b.x,b.y,b.width,b.height,-tw/2,-th/2,tw,th);
    ctx.restore();
  };
  if (placement.layout === 'repeat') {
    const side = Math.min(w/2,h/2) * (.38 + placement.scale);
    const pitch = side * 1.32;
    const startX = centerX - Math.ceil((centerX-x)/pitch)*pitch;
    const startY = centerY - Math.ceil((centerY-y)/pitch)*pitch;
    for (let py=startY; py<=y+h+pitch; py+=pitch) {
      for (let px=startX; px<=x+w+pitch; px+=pitch) draw(artwork,artworkBounds,px,py,side,side);
    }
  } else if (placement.layout === 'pair' && companion) {
    const side = Math.min(w * .42, 900 * placement.scale * .55);
    const offset = side * .57;
    draw(artwork,artworkBounds,centerX-offset,centerY,side,h*.8);
    draw(companion.canvas,companion.bounds,centerX+offset,centerY,side,h*.8);
  } else {
    draw(artwork,artworkBounds,centerX,centerY,900*placement.scale);
  }
  ctx.restore();
  ctx.save(); ctx.translate(f.x, f.y); ctx.scale(f.scale, f.scale);
  if (product === 'shirt') {
    ctx.strokeStyle = '#181b19'; ctx.lineWidth = 2.9; ctx.lineJoin = 'round'; ctx.stroke(new Path2D(template.path));
    ctx.lineWidth = 1.3; ctx.stroke(new Path2D('M270 126C277 171 303 207 369 208C435 208 460 171 467 126 M288 121C288 165 318 192 369 193C425 192 451 166 453 121 M164 158C183 220 179 323 160 374 M576 158C556 221 560 326 576 374 M60 272L143 377 M680 272L597 377'));
  } else if (product === 'handkerchief') {
    ctx.strokeStyle = '#879184'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 4]); ctx.stroke(new Path2D('M155 244H745V817H143Z'));
  }
  ctx.restore(); return result;
}

export async function renderProjectProduct(project:SancaiProject, product:ProductId, placement:Placement, size:number) {
  const sourceSize = size > 1024 ? 2048 : 768;
  const art = await ensureFiredArtifact(project, sourceSize);
  let companion: ArtworkRenderResult | undefined;
  const saved = placement.layout === 'pair' ? placement.companion : undefined;
  if (saved && project.firing) {
    companion = await ensureFiredArtifact({
      ...project, design: saved.design,
      firing: {...project.firing, design:saved.design, designHash:hashDesign(saved.design), seed:saved.seed, style:saved.style},
    }, sourceSize);
  }
  return renderFabricProduct({artwork:art.canvas,artworkBounds:art.bounds,companion,product,placement,size});
}
