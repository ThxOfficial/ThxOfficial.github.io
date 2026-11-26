export type TemplateId = 'horse' | 'camel' | 'official' | 'guardian' | 'vessel' | 'musicians';
export type GlazeId = 'amber' | 'ochre' | 'leafGreen' | 'jadeGreen' | 'cream' | 'cobalt' | 'warmBrown';
export type GlazeChoice = GlazeId | 'unglazed';
export type ProductId = 'tote' | 'shirt' | 'handkerchief';
export type FiringStyle = 'defined' | 'soft' | 'flowing';
export type ArtworkStage = 'bisque' | 'glazed' | 'fired';
export interface Rect { x: number; y: number; width: number; height: number }
export interface PrintCompanion { title: string; design: DesignSnapshot; style: FiringStyle; seed: number }
export interface Placement {
  x: number; y: number; scale: number; rotation: number; color: string;
  layout?: 'single' | 'repeat' | 'pair';
  companion?: PrintCompanion;
}
export interface PatternSpec { kind: 'dots' | 'diamonds' | 'ribbons'; colors: GlazeId[]; size: number; density: number; rotation: number; seed: number }
export interface RegionDesign { baseGlaze: GlazeChoice; amount: 'thin' | 'medium' | 'thick'; pattern?: PatternSpec }
export interface BrushStroke { id: string; regionId: string; glaze: GlazeId; radius: number; points: Array<[number, number]> }
export type TemplateVersion = 1 | 2 | 3 | 4 | 5;
export type Expression = 'smile' | 'alert';
export interface DesignSnapshot { templateId: TemplateId; templateVersion: TemplateVersion; regions: Record<string, RegionDesign>; strokes: BrushStroke[]; seed: number; expression?: Expression }
export interface FiringSnapshot { id: string; designRevision: number; designHash: string; design: DesignSnapshot; rendererVersion: '1'; style: FiringStyle; seed: number; status: 'queued' | 'rendering' | 'ready'; startedAt: string; completedAt?: string }
export interface SancaiProject { kind: 'sancai-project'; schemaVersion: 1; rendererVersion: '1'; id: string; parentProjectId?: string; title: string; createdAt: string; updatedAt: string; phase: 'preparation' | 'glazing' | 'firing' | 'finished'; preparationSeen: boolean; designRevision: number; design: DesignSnapshot; firing?: FiringSnapshot; products: Record<ProductId, Placement>; activeProduct: ProductId }
export interface TemplateRegion { id: string; label: string; path: string; zIndex: number; editable: boolean; allowGlaze: boolean; flowGroup: string; flowDirection: [number, number]; reliefStrength: number }
export interface DrawnDetail { path: string; color: string; opacity: number; stroke?: boolean; width?: number; facialLine?: boolean }
export interface SancaiTemplate { id: TemplateId; version: TemplateVersion; name: string; subtitle: string; description: string; viewBox: [0, 0, 1024, 1024]; silhouette: string; silhouetteFillRule: 'evenodd' | 'nonzero'; anchorBounds: Rect; regions: TemplateRegion[]; outlinePaths: string[]; outlineWidth?: number; outlineColor?: string; detailPaths: DrawnDetail[]; expressions?: Partial<Record<Expression, DrawnDetail[]>>; knowledgeSourceIds: string[] }
export interface ArtworkRenderResult { canvas: HTMLCanvasElement; bounds: Rect; revisionKey: string; source?: 'rendered' | 'disk-cache' }
