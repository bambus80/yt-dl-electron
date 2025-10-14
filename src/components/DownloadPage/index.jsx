import React, { useEffect, useState } from "react";
import "./index.css";

const DownloadPage = () => {
  useEffect(() => {
    window.yt.onProgress((msg) => {
      setProgress(msg);
    });
    window.yt.onDone((code) => {
      setIsDownloading(false);
    });
    window.yt.onError((error) => {
      setProgress(null);
      setIsDownloading(false);
      setError(error.message);
    });
  }, []);

  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [url, setUrl] = useState(null);

  const [format, setFormat] = useState("default");
  const [quality, setQuality] = useState("best");
  const [audioOnly, setAudioOnly] = useState(false);

  useEffect(() => {
    audioOnly ? setFormat("mp3") : setFormat("default");
  }, [audioOnly]);

  const handleDownload = async () => {
    console.log(quality, audioOnly);
    if (!url) {
      setError("Please enter a YouTube URL.");
      return;
    }
    const ytRegex =
      /(?:youtube\.com\/(?:.*v=|v\/|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const videoId = url.match(ytRegex)[1];
    if (!videoId) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    const result = await window.yt.startDownload(
      videoId,
      quality,
      format,
      audioOnly
    );
    setIsDownloading(true);
  };

  const videoQualityOptions = {
    best: "Highest",
    2160: "4K 2160p",
    1440: "HD 1440p",
    1080: "HD 1080p",
    720: "720p",
    480: "480p",
    360: "360p",
    240: "240p",
    144: "144p",
  };

  const videoFormatOptions = {
    default: "Default",
    webm: "WebM",
    mp4: "MP4",
    mkv: "MKV",
  };

  const audioFormatOptions = {
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
        <button
          className="download-button"
          disabled={isDownloading}
          onClick={() => handleDownload()}
        >
          Download
        </button>
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
                  {videoQualityOptions[key]}
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
