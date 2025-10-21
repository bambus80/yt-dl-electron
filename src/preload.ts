import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("yt", {
  startDownload: (id: string, quality: number, format: string, audioOnly: boolean, saveMode: "file" | "library") =>
    ipcRenderer.invoke("yt:startDownload", id, quality, format, audioOnly, saveMode),
  getVideoInfo: (id: string) => ipcRenderer.invoke("yt:getVideoInfo", id),
  getYtDlpInfo: () => ipcRenderer.invoke("yt:getYtDlpInfo"),

  onProgress: (callback: (args: any) => void) =>
    ipcRenderer.on("yt:downloadProgress", (_event, data) => callback(data)),
  onDone: (callback: (args: any) => void) =>
    ipcRenderer.on("yt:downloadDone", (_event, data) => callback(data)),
  onError: (callback: (args: any) => void) =>
    ipcRenderer.on("yt:downloadError", (_event, data) => callback(data)),
});
