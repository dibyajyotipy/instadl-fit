export interface ExportConfig {
  format: "png" | "jpeg";
  quality: number; // Float value between 0.1 and 1.0 (only applies to jpeg)
  filename: string;
}

/**
 * Triggers a browser download of the canvas contents as an image file.
 * Performs async toBlob conversion for optimal UI responsiveness.
 */
export function exportCanvasAsFile(
  canvas: HTMLCanvasElement,
  config: ExportConfig
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const format = config.format === "jpeg" ? "jpeg" : "png";
      const mimeType = `image/${format}`;
      // PNG ignored quality parameter in browsers, JPEG requires float 0 to 1
      const quality = format === "jpeg" ? config.quality : undefined;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(false);
            return;
          }

          // Create localized object URL for the image blob
          const url = URL.createObjectURL(blob);
          
          // Create temporary anchor and click it to trigger native download
          const link = document.createElement("a");
          const ext = format === "jpeg" ? "jpg" : "png";
          
          // Sanitize filename
          let safeFilename = config.filename.trim().replace(/[^a-z0-9_-]/gi, "_");
          if (!safeFilename) safeFilename = "instadl_fit";
          
          link.href = url;
          link.download = `${safeFilename}.${ext}`;
          
          document.body.appendChild(link);
          link.click();
          
          // Cleanup
          document.body.removeChild(link);
          
          // Small delay before revoking to make sure browser finished download initiation
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 500);

          resolve(true);
        },
        mimeType,
        quality
      );
    } catch (error) {
      console.error("Canvas export failed:", error);
      resolve(false);
    }
  });
}
