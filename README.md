# সুরঘর Surghor

Home of three music sites, with a mood radio that plays from all three.

- **আনন্দধারা Anandadhara** — Rabindrasangeet: https://smaju78.github.io/Anandadhara/
- **রাগমালা Raagmala** — Hindustani raags: https://smaju78.github.io/Raagmala/
- **পিয়ানো Piano** — classical piano: https://smaju78.github.io/Piano/

Live at https://smaju78.github.io/Surghor/ (GitHub Pages, branch `main`, folder `/`).

## Mood radio
Pick a mood (শান্ত, ভক্তি, প্রেম, বিরহ, আনন্দ, প্রকৃতি, সাহস) or let it guess one from the time of day and the
Bengali season. It builds a 24-track queue of YouTube recordings from the three sites' data
(`/Anandadhara/songs.json`, `/Raagmala/raagmala.json`, `/Piano/works.json`); raags are chosen for the current prahar.
It learns from skips, finished plays and likes. That memory stays in the browser (`localStorage` key `surghor.v1`).

## Files
- `index.html` — the whole page (CSS and JS inline).
- `manifest.webmanifest`, `sw.js`, `icon-*.png` — installable app and offline cache (bump `CACHE` in `sw.js` when
  adding files the page needs).
- `img/` — public-domain Tagore paintings, credited in `IMAGE-SOURCES.md`.
- `design/` — the three design concepts and build screenshots.

## Android app
Wrapped as a Trusted Web Activity with PWABuilder, package `io.github.smaju78.surghor`. The signing fingerprint is in
`/.well-known/assetlinks.json` of the `smaju78.github.io` repo. Keep the signing key safe; it is not in this repo.

## Run locally
Serve a folder that holds this repo as `Surghor/` next to the three sites' `docs/` folders linked as
`Anandadhara/`, `Raagmala/` and `Piano/`, then open `http://localhost:8000/Surghor/`:
```
python3 -m http.server 8000
```
