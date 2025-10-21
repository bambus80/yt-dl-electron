# yt-dl-electron
Simple GUI wrapper for `yt-dlp` written in Electron + React. It can download videos or just audio from YouTube.

## Run
No binary builds are provided yet so they will be have to built from source.

You can run this app without building it, but you have to download necessary binaries:
```sh
# npm
npm run download-deps
# pnpm
pnpm download-deps
```
After downloading these, you can run the app like this:
```sh
# npm
npm run start
# pnpm
pnpm start
```
This has only been tested on Linux.

## Build
You can build this app with:
```sh
# npm
npm run build
# pnpm
pnpm build
```
To build without downloading necessary binaries (make sure to download them on your own and put them in the `bin/` folder):
```sh
# npm
npm run build-no-dl
# pnpm
pnpm build-no-dl
```
The finished build will appear in the `out/yt-dl-electron-<PLATFORM>-<ARCH>` directory. Run the `yt-dl-electron` binary inside this directory to run the app.

# Third-party software
This app downloads `yt-dlp` and `ffmpeg` binaries when building (see `scripts/get-deps.js`) and uses them in runtime. A copy of the licenses for them is bundled with the built app.
## yt-dlp
`yt-dlp` is licensed under [Unlicense](https://github.com/yt-dlp/yt-dlp/blob/master/LICENSE).
## ffmpeg
`ffmpeg` is licensed under [LGPL-2.1-or-later](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html).