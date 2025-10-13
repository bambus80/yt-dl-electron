import React, { useState } from "react";
import "./index.css";

const DownloadPage = () => {
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  const [quality, setQuality] = useState("best");
  const [audioOnly, setAudioOnly] = useState(false);

  const download = async () => {
    console.log(quality, audioOnly);
    if (!url) {
      setError("Please enter a YouTube URL.");
      return;
    }
    const ytRegex =
      /(?:youtube\.com\/(?:.*v=|v\/|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const videoId = url.match(ytRegex);
    if (!videoId) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    const process = await window.yt.startDownload(
      videoId,
      quality,
      "webm",
      audioOnly
    );
    console.log(process);
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
        {error && <p className="url-error-status">{error}</p>}
        <button onClick={() => download()}>Download</button>
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
        <div className="download-option">
          <label htmlFor="format-setting">Format</label>
          <select
            name="format-setting"
            onChange={(e) => setQuality(e.target.value)}
          >
            {Object.keys(videoFormatOptions).map((key, index) => (
              <option key={index} value={key}>
                {videoFormatOptions[key]}
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
