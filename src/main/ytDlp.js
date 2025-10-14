import { ipcMain } from "electron";
import YTDlpWrap from "yt-dlp-wrap";

const ytDlpWrap = new YTDlpWrap();

ipcMain.handle(
  "yt:startDownload",
  async (event, id, quality, format, audioOnly) => {
    const process = ytDlpWrap
      .exec(
        [
          `https://www.youtube.com/watch?v=${id}`,
          "-f",
          audioOnly
            ? "bestaudio"
            : quality === "best"
              ? "b"
              : `best[height=${quality}]`,
          format !== "default" ? "--remux-video" : "",
          format !== "default" ? format : "",
          "-o",
          `"%(id)s.%(ext)s"`,
        ],
        { shell: true }
      )
      .on("progress", (progress) =>
        event.sender.send("yt:downloadProgress", progress)
      )
      .on("ytDlpEvent", (type, data) => {
        console.log("yt-dlp event:", type, data);
      })
      .on("close", (code) => {
        event.sender.send("yt:downloadDone", code);
      });
    process;
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
