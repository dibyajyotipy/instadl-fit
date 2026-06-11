import { getContainDimensions, type RatioDefinition } from "./aspectRatio";
import { drawSmartBlur } from "./blurGenerator";

export type BackgroundMode = "white" | "black" | "blur" | "gradient" | "custom";

export interface RenderOptions {
  backgroundMode: BackgroundMode;
  padding: number; // Padding percentage: 0% to 30%
  blurRadius: number; // Blur pixels: 0px to 100px
  blurBrightness: number; // Brightness multiplier: 0 to 1
  blurOpacity: number; // Tint overlay opacity: 0 to 1
  shadowEnabled: boolean; // Render drop shadow on original photo
  shadowBlur: number; // Shadow blur pixels: 0px to 80px
  shadowColor: string; // Shadow hex or rgba
  imageScale?: number; // Image scale: 0.3 to 1.5
  gradientColors?: string[]; // Array of gradient colors
  customColor?: string; // Custom solid color (hex, rgb, etc.)
  rotation?: number; // 0, 90, 180, 270 degrees
  flipH?: boolean;
  flipV?: boolean;
  alignX?: "left" | "center" | "right";
  alignY?: "top" | "center" | "bottom";
}

export const DEFAULT_RENDER_OPTIONS: RenderOptions = {
  backgroundMode: "blur",
  padding: 0,
  blurRadius: 40,
  blurBrightness: 0.7,
  blurOpacity: 0.35,
  shadowEnabled: true,
  shadowBlur: 30,
  shadowColor: "rgba(0, 0, 0, 0.45)",
  imageScale: 1.0,
  gradientColors: ["#7928ca", "#ff0080"],
  customColor: "#ffebf0",
  rotation: 0,
  flipH: false,
  flipV: false,
  alignX: "center",
  alignY: "center",
};

/**
 * High-performance browser rendering function.
 * Orchestrates canvas resizing (supports maxDimension scaling for preview speed),
 * background generation, padding offsets, shadows, and crisp foreground drawing.
 */
export function renderFitCanvas(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  ratio: RatioDefinition,
  options: RenderOptions = DEFAULT_RENDER_OPTIONS,
  maxDimension?: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Apply maximum preview dimension limit if specified (drastically speeds up preview redrawing)
  let targetWidth = ratio.width;
  let targetHeight = ratio.height;
  if (maxDimension) {
    const maxDim = Math.max(targetWidth, targetHeight);
    if (maxDim > maxDimension) {
      const scale = maxDimension / maxDim;
      targetWidth = Math.round(targetWidth * scale);
      targetHeight = Math.round(targetHeight * scale);
    }
  }

  // Set physical canvas size
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Reset drawing settings
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // 1. Draw Background
  if (options.backgroundMode === "white") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (options.backgroundMode === "black") {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (options.backgroundMode === "custom") {
    ctx.fillStyle = options.customColor || "#ffebf0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (options.backgroundMode === "blur") {
    drawSmartBlur(ctx, img, canvas.width, canvas.height, {
      blurRadius: options.blurRadius,
      brightness: options.blurBrightness,
      overlayOpacity: options.blurOpacity,
    });
  } else if (options.backgroundMode === "gradient") {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const colors = options.gradientColors || ["#7928ca", "#ff0080"];
    colors.forEach((color, idx) => {
      grad.addColorStop(idx / (colors.length - 1), color);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 2. Draw Center Image
  ctx.save();

  // Scale padding percentage to canvas pixel dimensions
  const minDimension = Math.min(canvas.width, canvas.height);
  const paddingPx = minDimension * (options.padding / 100);

  const activeWidth = canvas.width - paddingPx * 2;
  const activeHeight = canvas.height - paddingPx * 2;

  // Swap dimensions if rotated 90 or 270 degrees
  const imgWidth = img.naturalWidth || img.width;
  const imgHeight = img.naturalHeight || img.height;
  const rotation = options.rotation || 0;
  const effImgW = (rotation === 90 || rotation === 270) ? imgHeight : imgWidth;
  const effImgH = (rotation === 90 || rotation === 270) ? imgWidth : imgHeight;

  // Get contained dimensions inside active workspace
  const contain = getContainDimensions(effImgW, effImgH, activeWidth, activeHeight);

  // Apply scale
  const scale = options.imageScale !== undefined ? options.imageScale : 1.0;
  const scaledWidth = contain.width * scale;
  const scaledHeight = contain.height * scale;

  // Calculate alignment coordinates relative to the padded visual area
  const alignX = options.alignX || "center";
  const alignY = options.alignY || "center";

  let alignXOffset = (activeWidth - scaledWidth) / 2;
  if (alignX === "left") alignXOffset = 0;
  else if (alignX === "right") alignXOffset = activeWidth - scaledWidth;

  let alignYOffset = (activeHeight - scaledHeight) / 2;
  if (alignY === "top") alignYOffset = 0;
  else if (alignY === "bottom") alignYOffset = activeHeight - scaledHeight;

  // Position containing box offset by padding
  const drawX = alignXOffset + paddingPx;
  const drawY = alignYOffset + paddingPx;

  // Compute visual center for context translation
  const visualCenterX = drawX + scaledWidth / 2;
  const visualCenterY = drawY + scaledHeight / 2;

  // Go to center of drawing area to apply rotation/flip correctly
  ctx.translate(visualCenterX, visualCenterY);

  // Apply rotation
  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  // Apply flips
  const flipH = options.flipH || false;
  const flipV = options.flipV || false;
  if (flipH || flipV) {
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  }

  // Draw floating drop shadow for the foreground image
  if (options.shadowEnabled && options.backgroundMode !== "black") {
    const scaleFactor = minDimension / 1080;
    
    // Rotate/reflect shadow offset so that it always points DOWN in canvas-space
    let shadowOffsetX = 0;
    let shadowOffsetY = 10 * scaleFactor;

    if (rotation !== 0) {
      const rad = (rotation * Math.PI) / 180;
      const originalOffsetY = 10 * scaleFactor;
      shadowOffsetX = originalOffsetY * Math.sin(rad);
      shadowOffsetY = originalOffsetY * Math.cos(rad);
    }

    if (flipH) shadowOffsetX = -shadowOffsetX;
    if (flipV) shadowOffsetY = -shadowOffsetY;

    ctx.shadowColor = options.shadowColor;
    ctx.shadowBlur = options.shadowBlur * scaleFactor;
    ctx.shadowOffsetX = shadowOffsetX;
    ctx.shadowOffsetY = shadowOffsetY;
  }

  // Determine drawing sizes on rotated context
  const renderW = (rotation === 90 || rotation === 270) ? scaledHeight : scaledWidth;
  const renderH = (rotation === 90 || rotation === 270) ? scaledWidth : scaledHeight;

  // Render the source image sharp on top (centered at 0, 0)
  ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);

  // Restore context to turn off drop shadow and transformations
  ctx.restore();

  // Subtle border outline to separate image from background and prevent blending of similar colors
  ctx.save();
  ctx.strokeStyle = options.backgroundMode === "white" ? "rgba(9, 9, 11, 0.05)" : "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = Math.max(1, minDimension / 1080);
  ctx.strokeRect(drawX, drawY, scaledWidth, scaledHeight);
  ctx.restore();
}
