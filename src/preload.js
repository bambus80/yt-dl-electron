import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("yt", {
  startDownload: (id, quality, format, audioOnly) =>
    ipcRenderer.invoke("yt:startDownload", id, quality, format, audioOnly),
  getVideoInfo: (id) => ipcRenderer.invoke("yt:getVideoInfo", id),
  getYtDlpInfo: () => ipcRenderer.invoke("yt:getYtDlpInfo"),
});
