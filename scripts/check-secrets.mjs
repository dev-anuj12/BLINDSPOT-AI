import fs from "fs";
import path from "path";

const sensitivePatterns = [
  /AIza[0-9A-Za-z-_]{35}/,
  /sk-[a-zA-Z0-9]{32,}/,
  /GEMINI_API_KEY\s*=\s*["'][^"']+["']/,
];

let foundSecret = false;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === "node_modules" || file === ".next" || file === ".git" || file === ".env.example") continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js") || file.endsWith(".mjs") || file.endsWith(".json")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const pattern of sensitivePatterns) {
        if (pattern.test(content)) {
          console.error(`❌ Potential secret found in ${fullPath}`);
          foundSecret = true;
        }
      }
    }
  }
}

scanDir(".");

if (foundSecret) {
  process.exit(1);
} else {
  console.log("✓ Zero hardcoded secrets detected across source files!");
  process.exit(0);
}
