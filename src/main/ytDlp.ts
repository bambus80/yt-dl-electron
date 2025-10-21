import { app, ipcMain, dialog, BaseWindow } from "electron";
import { mainWindow } from "../main";
import YTDlpWrap from "yt-dlp-wrap";
const path = require("node:path");

const isDev = !app.isPackaged;
const ytDlpPath = isDev
  ? path.join(__dirname, "../../bin", process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp")
  : path.join(process.resourcesPath, process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp");
const ffmpegPath = isDev
  ? path.join(__dirname, "../../bin", process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg")
  : path.join(process.resourcesPath, process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg");

const ytDlpWrap = new YTDlpWrap();
ytDlpWrap.setBinaryPath(ytDlpPath);

ipcMain.handle(
  "yt:startDownload",
  async (event, id, quality, format, audioOnly, saveMode) => {
    console.log("yt-dlp start download");
    let error = null;
    // Base args
    if (format === 0) format = "best";
    let args = [
      `https://www.youtube.com/watch?v=${id}`,
      "-f",
      audioOnly
        ? "bestaudio"
        : quality === "best"
          ? "b"
          : `best[height=${quality}]`,
    ];
    // Remuxing
    if (audioOnly) {
      args = [...args, "-t", format];
    } else if (format !== "default") {
      args = [...args, "--remux-video", format];
    }
    // File output
    console.log("yt-dlp save mode:", saveMode);
    if (saveMode === "file") {
      await dialog
        .showSaveDialog(mainWindow as BaseWindow, {})
        .then((result) => {
          if (result.canceled) error = "Cancelled";
          args = [...args, "-o", `"${result.filePath}.%(ext)s"`];
        })
        .catch((error) => {
          error = error;
        });
    } else if (saveMode === "library") {
      console.log("TODO: Add library");
      error = "TODO: Add library";
    } else {
      error = "Invalid save option";
      // args = [...args, "-o", "%(id)s.%(ext)s"];
    }
    // Use bundled FFmpeg binary
    args = [...args, "--ffmpeg-location", ffmpegPath]; 

    console.log("yt-dlp flags:", args);

    if (error) {
      event.sender.send("yt:downloadError", error);
      return;
    }
    const process = ytDlpWrap
      .exec(args, { shell: true })
      .on("progress", (progress) =>
        event.sender.send("yt:downloadProgress", progress)
      )
      .on("error", (error) => event.sender.send("yt:downloadError", error))
      .on("ytDlpEvent", (type, data) => {
        console.log("yt-dlp event:", type, data);
      })
      .on("close", (code) => {
        event.sender.send("yt:downloadDone", code);
      });
  }
);

ipcMain.handle("yt:getVideoInfo", async (event, id) => {
  return ytDlpWrap.getVideoInfo(`https://www.youtube.com/watch?v=${id}`);
});

ipcMain.handle("yt:getYtDlpInfo", async () => {
  const version = await ytDlpWrap.getVersion();
  const userAgent = await ytDlpWrap.getUserAgent();
  return `yt-dlp ${version}, ${userAgent}`;
});
