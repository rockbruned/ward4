import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public/images", { recursive: true });

const src = "public/images/oshawa-creek.png";

await sharp(src)
  .resize(1920, 1080, { fit: "cover", position: "centre", kernel: sharp.kernel.lanczos3 })
  .modulate({ saturation: 1.05, brightness: 1.02 })
  .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.4 })
  .webp({ quality: 88, effort: 6 })
  .toFile("public/images/oshawa-creek.webp");

await sharp(src)
  .resize(1920, 1080, { fit: "cover", kernel: sharp.kernel.lanczos3 })
  .blur(12)
  .webp({ quality: 70 })
  .toFile("public/images/oshawa-creek-soft.webp");

console.log("Optimized creek backgrounds written to public/images/");
