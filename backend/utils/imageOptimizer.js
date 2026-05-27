const sharp = require('sharp');

/**
 * Optimizes a base64 encoded image string.
 * Resizes, compresses, and converts to JPEG format.
 */
const optimizeBase64Image = async (base64String, maxWidth = 1200) => {
  // If not a base64 image string, return as is
  if (!base64String || typeof base64String !== 'string' || !base64String.startsWith('data:image')) {
    return base64String;
  }

  try {
    // Extract base64 data
    const matches = base64String.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
    if (!matches) return base64String;

    const imageData = matches[2];
    const buffer = Buffer.from(imageData, 'base64');

    // Optimize using sharp
    const optimizedBuffer = await sharp(buffer)
      .resize({ 
        width: maxWidth, 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ 
        quality: 80, 
        progressive: true,
        mozjpeg: true 
      })
      .toBuffer();

    const optimizedBase64 = `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`;
    
    const originalSize = (base64String.length / 1024 / 1024).toFixed(2);
    const optimizedSize = (optimizedBase64.length / 1024 / 1024).toFixed(2);
    console.log(`[ImageOptimizer] Optimized: ${originalSize}MB -> ${optimizedSize}MB`);
    
    return optimizedBase64;
  } catch (error) {
    console.error("[ImageOptimizer] Error optimizing image:", error.message);
    return base64String; // Fallback to original
  }
};

module.exports = { optimizeBase64Image };
