import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("yt", {
  startDownload: (id, quality, format, audioOnly, saveMode) =>
    ipcRenderer.invoke("yt:startDownload", id, quality, format, audioOnly, saveMode),
  getVideoInfo: (id) => ipcRenderer.invoke("yt:getVideoInfo", id),
  getYtDlpInfo: () => ipcRenderer.invoke("yt:getYtDlpInfo"),

  onProgress: (callback) =>
    ipcRenderer.on("yt:downloadProgress", (_event, data) => callback(data)),
  onDone: (callback) =>
    ipcRenderer.on("yt:downloadDone", (_event, data) => callback(data)),
  onError: (callback) =>
    ipcRenderer.on("yt:downloadError", (_event, data) => callback(data)),
});
