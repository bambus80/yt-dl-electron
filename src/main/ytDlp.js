import { ipcMain } from "electron";
import YTDlpWrap from "yt-dlp-wrap";

const ytDlpWrap = new YTDlpWrap();

ipcMain.handle(
  "yt:startDownload",
  async (event, id, quality, format, audioOnly) => {
    // Base args
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
    // TODO: Download to user's preferred path
    args = [...args, "-o", '"%(id)s.%(ext)s"'];

    console.log("yt-dlp flags:", args);

    const process = ytDlpWrap
      .exec(args, { shell: true })
      .on("progress", (progress) =>
        event.sender.send("yt:downloadProgress", progress)
      )
      .on("error", (error) =>
        event.sender.send("yt:downloadError", error)
      )
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
