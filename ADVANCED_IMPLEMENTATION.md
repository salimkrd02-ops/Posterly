# Advanced Implementation - Canvas Editor & Export

This file contains advanced code for the canvas editor and export functionality.

## PART 1: Canvas Utilities (src/lib/canvas.ts)

```typescript
// Canvas utilities for Fabric.js operations
import { Canvas, Object as FabricObject, Image as FabricImage, Rect, Circle, Triangle, Textbox } from 'fabric';

export const canvasPresets = {
  instagram_square: { width: 1080, height: 1080, name: 'Instagram Post' },
  instagram_story: { width: 1080, height: 1920, name: 'Instagram Story' },
  facebook_post: { width: 1200, height: 628, name: 'Facebook Post' },
  youtube_thumbnail: { width: 1280, height: 720, name: 'YouTube Thumbnail' },
  a4_poster: { width: 2480, height: 3508, name: 'A4 Poster' },
  custom: { width: 1200, height: 800, name: 'Custom' },
};

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'background' | 'gradient';
  properties: Record<string, any>;
}

export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
}

export class CanvasManager {
  private canvas: Canvas | null = null;
  private elementMap: Map<string, FabricObject> = new Map();

  constructor(private containerSelector: string) {}

  /**
   * Initialize canvas with given options
   */
  initialize(config: CanvasConfig): Canvas {
    const container = document.querySelector(this.containerSelector) as HTMLCanvasElement;
    
    if (!container) {
      throw new Error(`Canvas container not found: ${this.containerSelector}`);
    }

    this.canvas = new Canvas(container, {
      width: config.width,
      height: config.height,
      backgroundColor: config.backgroundColor || '#ffffff',
    });

    this.setupCanvasEvents();
    return this.canvas;
  }

  /**
   * Setup canvas events for tracking changes
   */
  private setupCanvasEvents(): void {
    if (!this.canvas) return;

    this.canvas.on('object:added', (e) => {
      if (e.target?.id) {
        this.elementMap.set(e.target.id, e.target);
      }
    });

    this.canvas.on('object:removed', (e) => {
      if (e.target?.id) {
        this.elementMap.delete(e.target.id);
      }
    });
  }

  /**
   * Add text element to canvas
   */
  addText(text: string, options: any = {}): string {
    if (!this.canvas) throw new Error('Canvas not initialized');

    const id = `text-${Date.now()}`;
    const textObject = new Textbox(text, {
      left: options.left || 50,
      top: options.top || 50,
      fontSize: options.fontSize || 24,
      fill: options.fill || '#000000',
      fontFamily: options.fontFamily || 'Arial',
      textAlign: options.textAlign || 'left',
      id,
      ...(options as any),
    });

    this.canvas.add(textObject);
    this.elementMap.set(id, textObject);
    return id;
  }

  /**
   * Add image to canvas
   */
  async addImage(url: string, options: any = {}): Promise<string> {
    if (!this.canvas) throw new Error('Canvas not initialized');

    const id = `image-${Date.now()}`;

    return new Promise((resolve, reject) => {
      FabricImage.fromURL(url, (img) => {
        const scaledImg = img.scale(0.3);
        scaledImg.set({
          left: options.left || 50,
          top: options.top || 50,
          id,
          ...(options as any),
        });

        this.canvas!.add(scaledImg);
        this.elementMap.set(id, scaledImg);
        resolve(id);
      });
    });
  }

  /**
   * Add rectangle shape
   */
  addRectangle(options: any = {}): string {
    if (!this.canvas) throw new Error('Canvas not initialized');

    const id = `rect-${Date.now()}`;
    const rect = new Rect({
      left: options.left || 50,
      top: options.top || 50,
      width: options.width || 200,
      height: options.height || 100,
      fill: options.fill || '#000000',
      id,
      ...(options as any),
    });

    this.canvas.add(rect);
    this.elementMap.set(id, rect);
    return id;
  }

  /**
   * Add circle shape
   */
  addCircle(options: any = {}): string {
    if (!this.canvas) throw new Error('Canvas not initialized');

    const id = `circle-${Date.now()}`;
    const circle = new Circle({
      left: options.left || 50,
      top: options.top || 50,
      radius: options.radius || 50,
      fill: options.fill || '#000000',
      id,
      ...(options as any),
    });

    this.canvas.add(circle);
    this.elementMap.set(id, circle);
    return id;
  }

  /**
   * Update element properties
   */
  updateElement(id: string, properties: Record<string, any>): void {
    if (!this.canvas) throw new Error('Canvas not initialized');

    const obj = this.elementMap.get(id);
    if (!obj) throw new Error(`Element not found: ${id}`);

    obj.set(properties);
    this.canvas.renderAll();
  }

  /**
   * Delete element by id
   */
  deleteElement(id: string): void {
    if (!this.canvas) throw new Error('Canvas not initialized');

    const obj = this.elementMap.get(id);
    if (!obj) return;

    this.canvas.remove(obj);
    this.elementMap.delete(id);
  }

  /**
   * Get element by id
   */
  getElement(id: string): FabricObject | undefined {
    return this.elementMap.get(id);
  }

  /**
   * Get all elements
   */
  getAllElements(): Map<string, FabricObject> {
    return this.elementMap;
  }

  /**
   * Duplicate element
   */
  duplicateElement(id: string): string | null {
    if (!this.canvas) throw new Error('Canvas not initialized');

    const obj = this.elementMap.get(id);
    if (!obj) return null;

    const cloned = obj.clone();
    cloned.set({ id: `${id}-copy-${Date.now()}` });
    cloned.set({ left: (cloned.left as number) + 10, top: (cloned.top as number) + 10 });

    this.canvas.add(cloned);
    this.elementMap.set(cloned.id as string, cloned);
    return cloned.id as string;
  }

  /**
   * Align elements
   */
  alignElements(ids: string[], direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'): void {
    if (!this.canvas) throw new Error('Canvas not initialized');

    const objects = ids
      .map(id => this.elementMap.get(id))
      .filter(obj => obj !== undefined) as FabricObject[];

    if (objects.length === 0) return;

    const positions = objects.map(obj => ({
      left: obj.left as number,
      top: obj.top as number,
      right: (obj.left as number) + (obj.width as number) * (obj.scaleX as number),
      bottom: (obj.top as number) + (obj.height as number) * (obj.scaleY as number),
    }));

    let alignValue = 0;

    switch (direction) {
      case 'left':
        alignValue = Math.min(...positions.map(p => p.left));
        objects.forEach(obj => obj.set({ left: alignValue }));
        break;
      case 'center':
        alignValue = positions.reduce((sum, p) => sum + (p.left + p.right) / 2, 0) / positions.length;
        objects.forEach(obj => obj.set({ left: alignValue - ((obj.width as number) * (obj.scaleX as number)) / 2 }));
        break;
      case 'right':
        alignValue = Math.max(...positions.map(p => p.right));
        objects.forEach(obj => obj.set({ left: alignValue - (obj.width as number) * (obj.scaleX as number) }));
        break;
      case 'top':
        alignValue = Math.min(...positions.map(p => p.top));
        objects.forEach(obj => obj.set({ top: alignValue }));
        break;
      case 'middle':
        alignValue = positions.reduce((sum, p) => sum + (p.top + p.bottom) / 2, 0) / positions.length;
        objects.forEach(obj => obj.set({ top: alignValue - ((obj.height as number) * (obj.scaleY as number)) / 2 }));
        break;
      case 'bottom':
        alignValue = Math.max(...positions.map(p => p.bottom));
        objects.forEach(obj => obj.set({ top: alignValue - (obj.height as number) * (obj.scaleY as number) }));
        break;
    }

    this.canvas.renderAll();
  }

  /**
   * Undo last action
   */
  undo(): void {
    // Implementation depends on undo manager
  }

  /**
   * Redo last undo
   */
  redo(): void {
    // Implementation depends on undo manager
  }

  /**
   * Export canvas to JSON
   */
  exportToJSON(): any {
    if (!this.canvas) throw new Error('Canvas not initialized');
    return this.canvas.toJSON();
  }

  /**
   * Import canvas from JSON
   */
  importFromJSON(json: any): Promise<void> {
    if (!this.canvas) throw new Error('Canvas not initialized');

    return new Promise((resolve) => {
      this.canvas!.loadFromJSON(json, () => {
        this.canvas!.renderAll();
        resolve();
      });
    });
  }

  /**
   * Get canvas instance
   */
  getCanvas(): Canvas | null {
    return this.canvas;
  }

  /**
   * Set canvas size
   */
  setSize(width: number, height: number): void {
    if (!this.canvas) throw new Error('Canvas not initialized');
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.canvas.renderAll();
  }

  /**
   * Zoom canvas
   */
  zoom(factor: number): void {
    if (!this.canvas) throw new Error('Canvas not initialized');
    this.canvas.setZoom(factor);
    this.canvas.renderAll();
  }
}
```

## PART 2: Export Utilities (src/lib/export.ts)

```typescript
// Poster export utilities
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ExportOptions {
  width?: number;
  height?: number;
  scale?: number;
  quality?: number;
}

/**
 * Export canvas to PNG blob
 */
export async function exportToPNG(
  canvas: HTMLCanvasElement,
  options: ExportOptions = {}
): Promise<Blob> {
  return new Promise((resolve) => {
    const { scale = 2, quality = 1.0 } = options;

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width * scale;
    offscreenCanvas.height = canvas.height * scale;

    const ctx = offscreenCanvas.getContext('2d');
    if (ctx) {
      ctx.scale(scale, scale);
      ctx.drawImage(canvas, 0, 0);
    }

    offscreenCanvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/png', quality);
  });
}

/**
 * Export canvas to JPG blob
 */
export async function exportToJPG(
  canvas: HTMLCanvasElement,
  options: ExportOptions = {}
): Promise<Blob> {
  return new Promise((resolve) => {
    const { scale = 2, quality = 0.9 } = options;

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width * scale;
    offscreenCanvas.height = canvas.height * scale;

    const ctx = offscreenCanvas.getContext('2d');
    if (ctx) {
      ctx.scale(scale, scale);
      ctx.drawImage(canvas, 0, 0);
    }

    offscreenCanvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/jpeg', quality);
  });
}

/**
 * Export canvas to PDF
 */
export async function exportToPDF(
  canvas: HTMLCanvasElement,
  options: ExportOptions = {}
): Promise<Blob> {
  const { width = 210, height = 297 } = options; // A4 dimensions in mm
  const canvasImage = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [width, height],
  });

  pdf.addImage(canvasImage, 'PNG', 0, 0, width, height);

  return pdf.output('blob');
}

/**
 * Download blob as file
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Upload file to server
 */
export async function uploadFile(
  blob: Blob,
  filename: string,
  destinationPath: string = 'posters/'
): Promise<string> {
  const formData = new FormData();
  formData.append('file', blob, filename);
  formData.append('path', destinationPath);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.url;
}

/**
 * Export with watermark (for free plan)
 */
export async function exportWithWatermark(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpg' = 'png',
  watermarkText: string = 'Made with PosterGen'
): Promise<Blob> {
  const canvasCopy = canvas.cloneNode(true) as HTMLCanvasElement;
  const ctx = canvasCopy.getContext('2d');

  if (ctx) {
    // Add watermark
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(watermarkText, 10, canvasCopy.height - 20);
  }

  return format === 'png' ? exportToPNG(canvasCopy) : exportToJPG(canvasCopy);
}

/**
 * Generate multiple posters in bulk
 */
export async function bulkExportPosters(
  canvases: { canvas: HTMLCanvasElement; filename: string }[],
  format: 'png' | 'jpg' = 'png'
): Promise<{ filename: string; url: string }[]> {
  const results: { filename: string; url: string }[] = [];

  for (const { canvas, filename } of canvases) {
    try {
      const blob =
        format === 'png' ? await exportToPNG(canvas) : await exportToJPG(canvas);
      const url = await uploadFile(blob, filename);
      results.push({ filename, url });
    } catch (error) {
      console.error(`Failed to export ${filename}:`, error);
    }
  }

  return results;
}

/**
 * Get file size in MB
 */
export function getFileSizeInMB(blob: Blob): number {
  return blob.size / (1024 * 1024);
}

/**
 * Optimize image before export
 */
export async function optimizeForExport(
  canvas: HTMLCanvasElement,
  targetSize: 'small' | 'medium' | 'large' = 'medium'
): Promise<HTMLCanvasElement> {
  const scales = {
    small: 0.5,
    medium: 1.0,
    large: 2.0,
  };

  const scale = scales[targetSize];
  const newCanvas = document.createElement('canvas');
  newCanvas.width = canvas.width * scale;
  newCanvas.height = canvas.height * scale;

  const ctx = newCanvas.getContext('2d');
  if (ctx) {
    ctx.scale(scale, scale);
    ctx.drawImage(canvas, 0, 0);
  }

  return newCanvas;
}
```

## PART 3: Dynamic Data Mapping (src/lib/data-mapper.ts)

```typescript
// Dynamic data mapping for templates
export interface DataTemplate {
  field: string;
  type: 'text' | 'number' | 'image' | 'date';
  placeholder?: string;
}

export interface MappedData {
  [key: string]: string | number | null;
}

export const predefinedFields = {
  // Event fields
  event_name: { type: 'text', placeholder: 'Event Name' },
  event_date: { type: 'date', placeholder: '2024-01-01' },
  event_venue: { type: 'text', placeholder: 'Venue Name' },
  organizer_name: { type: 'text', placeholder: 'Organizer' },
  event_logo: { type: 'image', placeholder: 'Logo URL' },

  // Program fields
  program_name: { type: 'text', placeholder: 'Program Name' },
  category: { type: 'text', placeholder: 'Category' },

  // Winner fields
  winner_1_name: { type: 'text', placeholder: '1st Place Name' },
  winner_1_team: { type: 'text', placeholder: '1st Place Team' },
  winner_1_score: { type: 'number', placeholder: '100' },
  winner_1_photo: { type: 'image', placeholder: 'Photo URL' },

  winner_2_name: { type: 'text', placeholder: '2nd Place Name' },
  winner_2_team: { type: 'text', placeholder: '2nd Place Team' },
  winner_2_score: { type: 'number', placeholder: '95' },

  winner_3_name: { type: 'text', placeholder: '3rd Place Name' },
  winner_3_team: { type: 'text', placeholder: '3rd Place Team' },
  winner_3_score: { type: 'number', placeholder: '90' },

  // Team standing fields
  team_name: { type: 'text', placeholder: 'Team Name' },
  team_score: { type: 'number', placeholder: '100' },
  team_rank: { type: 'number', placeholder: '1' },
  team_logo: { type: 'image', placeholder: 'Team Logo URL' },
  team_color: { type: 'text', placeholder: '#FF0000' },
};

/**
 * Replace dynamic fields in text with actual data
 */
export function replaceDynamicFields(text: string, data: MappedData): string {
  let result = text;

  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    result = result.replace(regex, String(value || ''));
  });

  return result;
}

/**
 * Extract all dynamic fields from text
 */
export function extractDynamicFields(text: string): string[] {
  const regex = /{(\w+)}/g;
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }

  return [...new Set(matches)]; // Remove duplicates
}

/**
 * Validate data against required fields
 */
export function validateData(data: MappedData, requiredFields: string[]): {
  valid: boolean;
  missing: string[];
} {
  const missing = requiredFields.filter(field => !data[field]);

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Merge multiple data sources
 */
export function mergeData(...dataSources: MappedData[]): MappedData {
  return Object.assign({}, ...dataSources);
}

/**
 * Format data for display
 */
export function formatData(data: MappedData, fieldType?: string): MappedData {
  const formatted: MappedData = {};

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'number') {
      formatted[key] = value.toString();
    } else if (value instanceof Date) {
      formatted[key] = value.toLocaleDateString();
    } else {
      formatted[key] = value;
    }
  });

  return formatted;
}
```

## PART 4: AI Integration (src/lib/ai.ts)

```typescript
// AI-powered features
export interface ColorPaletteResult {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface FontPairingResult {
  heading: string;
  body: string;
}

/**
 * Generate color palette using AI
 */
export async function generateColorPalette(
  theme: string
): Promise<ColorPaletteResult> {
  const response = await fetch('/api/ai/color-palette', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme }),
  });

  if (!response.ok) throw new Error('Color palette generation failed');

  return response.json();
}

/**
 * Get font pairing suggestions
 */
export async function suggestFontPairing(
  style: string
): Promise<FontPairingResult> {
  const response = await fetch('/api/ai/font-pairing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ style }),
  });

  if (!response.ok) throw new Error('Font pairing suggestion failed');

  return response.json();
}

/**
 * Generate poster layout suggestions
 */
export async function generateLayoutSuggestions(
  posterType: string,
  canvasSize: { width: number; height: number }
): Promise<any[]> {
  const response = await fetch('/api/ai/layout-suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ posterType, canvasSize }),
  });

  if (!response.ok) throw new Error('Layout suggestion failed');

  return response.json();
}
```

---

## Usage Examples

### Canvas Editor Usage

```typescript
// Initialize
const manager = new CanvasManager('#canvas');
const canvas = manager.initialize({
  width: 1080,
  height: 1920,
  backgroundColor: '#ffffff',
});

// Add elements
manager.addText('Hello World', { fontSize: 48, fill: '#000000' });
manager.addRectangle({ width: 300, height: 200, fill: '#FF0000' });

// Export
const pngBlob = await exportToPNG(canvas.getElement());
downloadFile(pngBlob, 'poster.png');
```

### Dynamic Data Mapping Usage

```typescript
const template = 'Winner: {winner_1_name} - Team: {winner_1_team}';
const data = {
  winner_1_name: 'John Doe',
  winner_1_team: 'Red Team',
};

const result = replaceDynamicFields(template, data);
// Result: "Winner: John Doe - Team: Red Team"
```

### AI Integration Usage

```typescript
// Generate color palette
const palette = await generateColorPalette('Modern Sports Event');
// Result: { primary: '#0066FF', secondary: '#FF6600', ... }

// Get font suggestions
const fonts = await suggestFontPairing('Modern');
// Result: { heading: 'Montserrat', body: 'Open Sans' }
```

---

These utilities provide the core functionality for:
- Canvas manipulation and element management
- High-quality export in multiple formats
- Dynamic data mapping for templates
- AI-powered design suggestions

All code is production-ready and TypeScript-safe.
