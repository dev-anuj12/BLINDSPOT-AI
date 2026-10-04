import fs from "fs";
import path from "path";

const KNOWN_ROUTES = ["/", "/analyze", "/results", "/privacy", "/terms", "/api/analyze"];

console.log("Checking internal links across project codebase...");

const directoriesToScan = ["app", "components"];
let totalLinksChecked = 0;
let brokenLinks = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  // Match href="..." and router.push("...")
  const hrefMatches = content.matchAll(/(?:href|router\.push)\s*(?:=\s*|\(\s*)["'](\/[^"']*)["']/g);

  for (const match of hrefMatches) {
    const link = match[1].split("?")[0].split("#")[0];
    totalLinksChecked++;

    if (!KNOWN_ROUTES.includes(link) && !link.startsWith("/_next") && !link.startsWith("/favicon")) {
      brokenLinks.push({ file: filePath, link });
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".jsx") || file.endsWith(".js")) {
      scanFile(fullPath);
    }
  }
}

for (const dir of directoriesToScan) {
  if (fs.existsSync(dir)) {
    walkDir(dir);
  }
}

console.log(`Scanned ${totalLinksChecked} internal link occurrences.`);
if (brokenLinks.length > 0) {
  console.error("Found broken internal links:", brokenLinks);
  process.exit(1);
} else {
  console.log("✓ All internal links verified successfully!");
  process.exit(0);
}
