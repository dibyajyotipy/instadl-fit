import { getCoverDimensions } from "./aspectRatio";

export interface BlurOptions {
  blurRadius: number;
  brightness: number; // Factor like 0.7
  overlayOpacity: number; // Opacity of a black overlay, e.g., 0.35
}

/**
 * Renders a smart blurred background of the image onto the canvas.
 * Optimized for performance: uses a small offscreen canvas to perform the filter
 * operation, providing smooth depth-of-field blurs at 60fps with zero lag.
 */
export function drawSmartBlur(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  canvasWidth: number,
  canvasHeight: number,
  options: BlurOptions = { blurRadius: 40, brightness: 0.70, overlayOpacity: 0.35 }
) {
  // Create a smaller offscreen canvas for extremely fast blur processing
  const blurCanvas = document.createElement("canvas");
  
  // Cap the blur computation resolution at 256px to ensure high-performance rendering
  const maxBlurDim = 256;
  let blurWidth = canvasWidth;
  let blurHeight = canvasHeight;
  
  if (Math.max(canvasWidth, canvasHeight) > maxBlurDim) {
    const scale = maxBlurDim / Math.max(canvasWidth, canvasHeight);
    blurWidth = Math.round(canvasWidth * scale);
    blurHeight = Math.round(canvasHeight * scale);
  }
  
  blurCanvas.width = blurWidth;
  blurCanvas.height = blurHeight;
  
  const blurCtx = blurCanvas.getContext("2d");
  if (!blurCtx) {
    // Fallback: draw flat black background if canvas context is unavailable
    ctx.save();
    ctx.fillStyle = "#0e0e11";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
    return;
  }
  
  // Calculate sizing for cover fit (CSS object-fit: cover) on the mini canvas
  const imgWidth = img instanceof HTMLImageElement ? img.naturalWidth || img.width : img.width;
  const imgHeight = img instanceof HTMLImageElement ? img.naturalHeight || img.height : img.height;
  const cover = getCoverDimensions(imgWidth, imgHeight, blurWidth, blurHeight);
  
  // Scale the background image dynamically based on the blur radius.
  // This pushes blurry edge bleed artifacts completely out of the crop boundaries.
  const bleedPadding = Math.max(1.10, 1.0 + (options.blurRadius * 3.5) / Math.min(canvasWidth, canvasHeight));
  const w = cover.width * bleedPadding;
  const h = cover.height * bleedPadding;
  const x = cover.x - (w - cover.width) / 2;
  const y = cover.y - (h - cover.height) / 2;
  
  // Scale down blur radius relative to offscreen canvas dimensions
  const scaleRatio = blurWidth / canvasWidth;
  const scaledBlur = Math.max(1, options.blurRadius * scaleRatio);
  
  blurCtx.save();
  if (typeof blurCtx.filter === "string") {
    blurCtx.filter = `blur(${scaledBlur}px) brightness(${options.brightness})`;
  }
  
  // Draw scaled background onto the mini canvas
  blurCtx.drawImage(img, x, y, w, h);
  blurCtx.restore();
  
  // Draw the small blurred canvas scaled up onto the main canvas.
  // Browser's bilinear scaling creates an even softer, smoother blending!
  ctx.save();
  ctx.drawImage(blurCanvas, 0, 0, canvasWidth, canvasHeight);
  ctx.restore();
  
  // Apply a radial cinematic vignette overlay to keep the center popping
  // while fading the borders into a smooth focus frame.
  if (options.overlayOpacity > 0) {
    const radialGrad = ctx.createRadialGradient(
      canvasWidth / 2, canvasHeight / 2, Math.min(canvasWidth, canvasHeight) * 0.15,
      canvasWidth / 2, canvasHeight / 2, Math.max(canvasWidth, canvasHeight) * 0.8
    );
    radialGrad.addColorStop(0, `rgba(0, 0, 0, ${options.overlayOpacity * 0.6})`);
    radialGrad.addColorStop(1, `rgba(0, 0, 0, ${options.overlayOpacity * 1.15})`);
    
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
}
