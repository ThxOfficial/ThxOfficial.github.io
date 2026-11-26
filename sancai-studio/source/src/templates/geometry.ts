// Normalize the winding of each closed subpath before concatenating shapes.
// With nonzero filling, two overlapping shapes of opposite winding can cancel
// into a transparent hole. Region drawing is separate; the silhouette is a union.
type Point = [number, number];
interface Segment { kind: 'L' | 'Q' | 'C'; from: Point; to: Point; controls: number[] }
export function unionSilhouette(paths: string[]): string {
  const result: string[] = [];
  for (const path of paths) {
    const tokens = path.match(/[MLCQZ]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi) || [];
    let i = 0, start: Point = [0, 0], current: Point = start, segments: Segment[] = [];
    const finish = () => {
      if (!segments.length) return;
      let area = current[0] * start[1] - start[0] * current[1];
      for (const s of segments) area += s.from[0] * s.to[1] - s.to[0] * s.from[1];
      if (area < 0) {
        const parts = [`M${current.join(' ')}`];
        for (const s of [...segments].reverse()) {
          const c = s.kind === 'C' ? [s.controls[2], s.controls[3], s.controls[0], s.controls[1]] : s.controls;
          parts.push(`${s.kind}${[...c, ...s.from].join(' ')}`);
        }
        result.push(parts.join(' ') + 'Z');
      } else {
        result.push(`M${start.join(' ')} ` + segments.map(s => `${s.kind}${[...s.controls, ...s.to].join(' ')}`).join(' ') + 'Z');
      }
      segments = [];
    };
    while (i < tokens.length) {
      const command = tokens[i++].toUpperCase();
      if (command === 'Z') { finish(); current = start; continue; }
      const count = command === 'C' ? 6 : command === 'Q' ? 4 : 2;
      const values = tokens.slice(i, i + count).map(Number); i += count;
      const end: Point = [values[count - 2], values[count - 1]];
      if (command === 'M') { finish(); start = end; current = end; continue; }
      if (command !== 'L' && command !== 'Q' && command !== 'C') throw new Error('模板轮廓使用了不支持的路径指令');
      segments.push({ kind: command, from: current, to: end, controls: values.slice(0, -2) });
      current = end;
    }
    finish();
  }
  return result.join(' ');
}
