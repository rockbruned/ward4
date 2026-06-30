import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public/images", { recursive: true });

const upscale = (src, out, width, height) =>
  sharp(src)
    .resize(width, height, {
      fit: "cover",
      position: "centre",
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 0.9, m1: 1.1, m2: 0.35 })
    .webp({ quality: 94, effort: 6, smartSubsample: false })
    .toFile(out);

await upscale("public/images/creek-bridge.png", "public/images/creek-bridge.webp", 1400, 1050);
await upscale("public/images/creek-historic.png", "public/images/creek-historic.webp", 900, 720);
await upscale("public/images/creek-stream.png", "public/images/creek-stream.webp", 900, 720);

console.log("High-quality creek images written to public/images/");
