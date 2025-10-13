import { ipcMain } from "electron";
import YTDlpWrap from "yt-dlp-wrap";

const ytDlpWrap = new YTDlpWrap();

ipcMain.handle(
  "yt:startDownload",
  async (event, id, quality, format, audioOnly) => {
    return ytDlpWrap.exec(
      [
        id,
        "-f",
        audioOnly
          ? "bestaudio"
          : quality === "best"
            ? "b"
            : `best[height=${quality}]`,
        format !== "webm" ? "--remux-video" : "",
        format !== "webm" ? format : "",
      ],
      { shell: true }
    );
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
