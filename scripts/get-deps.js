import { mkdirSync, existsSync, createWriteStream, chmodSync } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import https from "https";
import path from "path";
import AdmZip from "adm-zip";
import { execSync } from "child_process";

const streamPipeline = promisify(pipeline);

// --- Binaries ---
const YTDLP_BINARIES = {
  win32: "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe",
  darwin:
    "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos",
  linux:
    "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux",
};

const FFMPEG_BINARIES = {
  win32: "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip",
  darwin: "https://evermeet.cx/ffmpeg/ffmpeg-6.1.zip",
  linux:
    "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz",
};

// --- Platform detection ---
const platform = process.platform;
const ytDlpUrl = YTDLP_BINARIES[platform];
const ffmpegUrl = FFMPEG_BINARIES[platform];

if (!ytDlpUrl || !ffmpegUrl) {
  console.error(`Unsupported platform: ${platform}`);
  process.exit(1);
}

const binDir = path.resolve("bin");
if (!existsSync(binDir)) mkdirSync(binDir, { recursive: true });

// ----------------- Helpers -----------------

async function fetchWithRedirect(url, depth = 0) {
  if (depth > 5) throw new Error("Too many redirects");

  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          const redirectUrl = new URL(res.headers.location, url).toString();
          console.log(`Redirecting to: ${redirectUrl}`);
          resolve(fetchWithRedirect(redirectUrl, depth + 1));
        } else if (res.statusCode === 200) {
          resolve(res);
        } else {
          reject(
            new Error(`Failed to download (${res.statusCode}) from ${url}`)
          );
        }
      })
      .on("error", reject);
  });
}

async function downloadFile(url, outputPath, makeExecutable = false) {
  if (existsSync(outputPath)) {
    console.log(`Skipping download, already exists: ${outputPath}`);
    return;
  }
  console.log(`Downloading: ${url}`);
  const res = await fetchWithRedirect(url);
  const file = createWriteStream(outputPath);
  await streamPipeline(res, file);
  if (makeExecutable) chmodSync(outputPath, 0o755);
  console.log(`Saved to ${outputPath}`);
}

// ----------------- Extraction -----------------

async function extractFFmpeg(archivePath, outputBinaryPath) {
  if (existsSync(outputBinaryPath)) {
    console.log(`Skipping extraction, already extracted: ${outputBinaryPath}`);
    return;
  }
  if (archivePath.endsWith(".zip")) {
    const zip = new AdmZip(archivePath);
    const zipEntries = zip.getEntries();
    // Find the ffmpeg binary
    const ffmpegEntry = zipEntries.find((e) =>
      e.entryName.endsWith(platform === "win32" ? "ffmpeg.exe" : "ffmpeg")
    );
    if (!ffmpegEntry) throw new Error("ffmpeg binary not found in ZIP");
    zip.extractEntryTo(
      ffmpegEntry,
      path.dirname(outputBinaryPath),
      false,
      true,
      path.basename(outputBinaryPath)
    );
    if (platform !== "win32") chmodSync(outputBinaryPath, 0o755);
  } else if (archivePath.endsWith(".tar.xz")) {
    const outputDir = path.dirname(outputBinaryPath);

    try {
      execSync(
        `tar -xJf "${archivePath}" --wildcards --strip-components=1 -C "${outputDir}" "*/ffmpeg"`,
        { stdio: "inherit" }
      );

      if (!existsSync(outputBinaryPath)) {
        throw new Error("ffmpeg binary not found after extraction");
      }

      chmodSync(outputBinaryPath, 0o755);
      console.log(`ffmpeg extracted to ${outputBinaryPath}`);
    } catch (err) {
      throw new Error(`Failed to extract ffmpeg: ${err.message}`);
    }
  } else {
    throw new Error("Unsupported archive format for ffmpeg");
  }
}

// ----------------- Main -----------------

(async () => {
  try {
    const ytDlpFile = path.join(
      binDir,
      platform === "win32" ? "yt-dlp.exe" : "yt-dlp"
    );
    await downloadFile(ytDlpUrl, ytDlpFile, platform !== "win32");

    const ffmpegArchive = path.join(binDir, path.basename(ffmpegUrl));
    await downloadFile(ffmpegUrl, ffmpegArchive);

    const ffmpegBinary = path.join(
      binDir,
      platform === "win32" ? "ffmpeg.exe" : "ffmpeg"
    );
    await extractFFmpeg(ffmpegArchive, ffmpegBinary);

    console.log(`Binaries downloaded:`);
    console.log(` - yt-dlp: ${ytDlpFile}`);
    console.log(` - ffmpeg: ${ffmpegBinary}`);

    process.exit(0);
  } catch (err) {
    console.error("Download or extraction failed:", err.message);
    process.exit(1);
  }
})();
