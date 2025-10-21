interface Window {
  yt: {
    onProgress: (callback: (msg: { percent: number }) => void) => void;
    onDone: (callback: () => void) => void;
    onError: (callback: (error: { message: string }) => void) => void;
    startDownload: (
      videoId: string,
      quality: string,
      format: string,
      audioOnly: boolean,
      saveMode: string
    ) => Promise<void>;
  };
}
