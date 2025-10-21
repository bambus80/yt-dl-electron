import React, { useEffect, useState } from "react";
import "./index.css";

type SettingsObject<T extends string | number> = {
  [key in T]: string;
};
type YtDlpMessage = { percent: number }

const DownloadPage: React.FC = () => {
  useEffect(() => {
    window.yt.onProgress((msg: YtDlpMessage) => {
      setProgress(msg);
    });
    window.yt.onDone(() => {
      setIsDownloading(false);
    });
    window.yt.onError((error: { message: string }) => {
      setProgress(null);
      setIsDownloading(false);
      setError(error.message);
    });
  }, []);

  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<YtDlpMessage | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [saveMode, setSaveMode] = useState<string>("file");
  const [url, setUrl] = useState<string | null>(null);

  const [format, setFormat] = useState<string>("default");
  const [quality, setQuality] = useState<string>("best");
  const [audioOnly, setAudioOnly] = useState<boolean>(false);

  useEffect(() => {
    audioOnly ? setFormat("mp3") : setFormat("default");
  }, [audioOnly]);

  const handleDownload = async () => {
    if (!url) {
      setError("Please enter a YouTube URL.");
      return;
    }
    setError(null);
    const ytRegex: RegExp =
      /(?:youtube\.com\/(?:.*v=|v\/|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const videoId = url.match(ytRegex);
    if (!videoId) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    setIsDownloading(true);
    const result = await window.yt.startDownload(
      videoId[1] ?? "",
      quality,
      format,
      audioOnly,
      saveMode
    );
  };

  const saveOptions: SettingsObject<string> = {
    file: "File",
    library: "To library",
  };

  const videoQualityOptions: SettingsObject<number> = {
    0: "Highest",
    2160: "4K 2160p",
    1440: "HD 1440p",
    1080: "HD 1080p",
    720: "720p",
    480: "480p",
    360: "360p",
    240: "240p",
    144: "144p",
  };

  const videoFormatOptions: SettingsObject<string> = {
    default: "Default",
    webm: "WebM",
    mp4: "MP4",
    mkv: "MKV",
  };

  const audioFormatOptions: SettingsObject<string> = {
    mp3: "MP3",
    wav: "Wav",
    flac: "FLAC",
    aac: "AAC",
  };

  return (
    <>
      <div className="download-input">
        <input
          style={error ? { borderColor: "var(--main-error-color)" } : {}}
          type="url"
          className="url-input"
          placeholder="YouTube URL..."
          onChange={(e) => {
            if (error) setError(null);
            setUrl(e.target.value);
          }}
        />
        {isDownloading && (
          <p className="download-status">
            {progress ? `${progress.percent}% done` : "Starting download..."}
          </p>
        )}
        {error && <p className="url-error-status">{error}</p>}
        <div className="download-button-container">
          <button
            className="download-button"
            disabled={isDownloading}
            onClick={() => handleDownload()}
          >
            Download
          </button>
          <select
            name="save-setting"
            onChange={(e) => setSaveMode(e.target.value)}
          >
            {Object.keys(saveOptions).map((key, index) => (
              <option key={index} value={key}>
                {saveOptions[key]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="download-options">
        <div className="download-option">
          <label htmlFor="audio-only">Audio only</label>
          <input
            type="checkbox"
            name="audio-only"
            onChange={(e) => setAudioOnly(e.target.checked)}
          />
        </div>
        {!audioOnly && (
          <div className="download-option">
            <label htmlFor="quality-setting">Quality</label>
            <select
              name="quality-setting"
              onChange={(e) => setQuality(e.target.value)}
            >
              {Object.keys(videoQualityOptions).map((key, index) => (
                <option key={index} value={key}>
                  {videoQualityOptions[key as unknown as number]}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="download-option">
          <label htmlFor="format-setting">Format</label>
          <select
            name="format-setting"
            onChange={(e) => setFormat(e.target.value)}
          >
            {Object.keys(
              audioOnly ? audioFormatOptions : videoFormatOptions
            ).map((key, index) => (
              <option key={index} value={key}>
                {audioOnly ? audioFormatOptions[key] : videoFormatOptions[key]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="download-info"></div>
    </>
  );
};

export default DownloadPage;
