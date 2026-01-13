import fs from "fs";
import path from "path";

const src = path.join("public", "admin", "config.yml");
const destDir = path.join("dist", "admin");
const dest = path.join(destDir, "config.yml");

if (!fs.existsSync(src)) {
  console.error("❌ Missing source config:", src);
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log("✅ Copied admin config:", src, "->", dest);