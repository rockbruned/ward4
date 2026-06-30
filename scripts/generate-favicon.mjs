import sharp from "sharp";
import { copyFileSync, mkdirSync } from "fs";

const logoSrc = "public/images/insportify-logo.svg";

mkdirSync("public/images", { recursive: true });
copyFileSync(
  "c:/Users/don/.cursor/frontend/public/logo.svg",
  logoSrc,
);

await sharp(logoSrc).resize(32, 32).png().toFile("app/icon.png");
await sharp(logoSrc).resize(180, 180).png().toFile("app/apple-icon.png");
await sharp(logoSrc).resize(32, 32).toFile("app/favicon.ico");

console.log("INsportify favicons written to app/icon.png, app/apple-icon.png, app/favicon.ico");
