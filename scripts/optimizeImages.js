const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Configuration
const sourceDir = path.join(__dirname, "../public");
const outputDir = path.join(__dirname, "../public/optimized");
const sizes = [2048, 1024, 640, 320]; // Responsive sizes
const formats = ["webp", "avif"]; // Modern formats
const quality = 80;

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all image files
function getImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && file !== "optimized") {
      getImageFiles(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Process each image
async function processImage(imagePath) {
  const filename = path.basename(imagePath, path.extname(imagePath));
  const relativePath = path.relative(sourceDir, path.dirname(imagePath));
  const destDir = path.join(outputDir, relativePath);

  // Create destination directory
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  try {
    // Load the image once
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    // Skip if already optimized
    if (metadata.width <= 640 && metadata.format === "webp") {
      return;
    }

    // Generate different sizes
    for (const size of sizes) {
      // Skip sizes larger than original
      if (size > metadata.width) continue;

      // Original format with better compression
      await image
        .resize(size)
        .jpeg({ quality, progressive: true })
        .toFile(path.join(destDir, `${filename}-${size}.jpg`));

      // Modern formats
      for (const format of formats) {
        await image
          .resize(size)
          [format]({ quality })
          .toFile(path.join(destDir, `${filename}-${size}.${format}`));
      }
    }

    console.log(`Optimized: ${imagePath}`);
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
  }
}

// Main function
async function optimizeImages() {
  console.log("Finding image files...");
  const imageFiles = getImageFiles(sourceDir);
  console.log(`Found ${imageFiles.length} images to process.`);

  // Process in batches to avoid memory issues
  const batchSize = 5;
  for (let i = 0; i < imageFiles.length; i += batchSize) {
    const batch = imageFiles.slice(i, i + batchSize);
    await Promise.all(batch.map(processImage));
    console.log(
      `Processed ${Math.min(i + batchSize, imageFiles.length)}/${
        imageFiles.length
      } images`
    );
  }

  console.log("Image optimization complete!");
}

// Run the optimization
optimizeImages().catch(console.error);
