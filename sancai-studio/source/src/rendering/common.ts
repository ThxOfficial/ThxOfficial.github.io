export function canvas(width: number, height = width) {
  const result = document.createElement('canvas');
  result.width = width; result.height = height;
  return result;
}

export function drawCloth(ctx: CanvasRenderingContext2D, width: number, height: number, color = '#fffdf4') {
  ctx.fillStyle = color; ctx.fillRect(0, 0, width, height);
  ctx.save(); ctx.strokeStyle = 'rgba(94,88,67,.035)'; ctx.lineWidth = Math.max(.35, width / 2048);
  const step = Math.max(2, width / 180); ctx.beginPath();
  for (let x = 0; x < width; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
  for (let y = 0; y < height; y += step) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
  ctx.stroke(); ctx.restore();
}

export function blobFromCanvas(value: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => value.toBlob(blob => blob ? resolve(blob) : reject(new Error('图片导出失败，请重试')), 'image/png'));
}

export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob), anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
