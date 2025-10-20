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
The finished build will appear in the `out/yt-dl-electron-<PLATFORM>-<ARCH>` directory. Run the `yt-dl-electron` binary inside this directory to run the app.