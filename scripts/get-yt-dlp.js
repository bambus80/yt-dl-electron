import { mkdirSync, existsSync, createWriteStream, chmodSync } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import https from "https";
import path from "path";

const streamPipeline = promisify(pipeline);

const PLATFORM_BINARIES = {
  win32: "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe",
  darwin: "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos",
  linux: "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux",
};

const platform = process.platform;
const url = PLATFORM_BINARIES[platform];

if (!url) {
  console.error(`Unsupported platform: ${platform}`);
  process.exit(1);
}

const outDir = path.resolve("bin");
const outFile = path.join(outDir, platform === "win32" ? "yt-dlp.exe" : "yt-dlp");

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

console.log(`Downloading yt-dlp for ${platform}...`);

async function fetchWithRedirect(url, depth = 0) {
  if (depth > 5) throw new Error("Too many redirects");

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).toString();
        console.log(`Redirecting to: ${redirectUrl}`);
        resolve(fetchWithRedirect(redirectUrl, depth + 1));
      } else if (res.statusCode === 200) {
        resolve(res);
      } else {
        reject(new Error(`Failed to download (${res.statusCode}) from ${url}`));
      }
    }).on("error", reject);
  });
}

try {
  const response = await fetchWithRedirect(url);
  const file = createWriteStream(outFile);
  await streamPipeline(response, file);

  if (platform !== "win32") chmodSync(outFile, 0o755);

  console.log(`yt-dlp saved to ${outFile}`);
  process.exit(0);
} catch (err) {
  console.error("Download failed:", err.message);
  process.exit(1);
}
