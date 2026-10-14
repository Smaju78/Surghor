# Design references — সুরঘর Surghor

`mockups/` holds three redesign concepts for the Surghor home page / Android app (phase 1: concepts only; the live
`index.html`, `sw.js`, manifest and icons are untouched). They are click-through prototypes that run the real mood
radio on the three sites' real data: time of day and Bengali season (same cut-offs as the live page), the mood guess,
the mixed 24-track queue, skip/finish/like learning in `localStorage`, and the YouTube IFrame player. All three share
`mockups/common.js` (the radio engine, lifted from `index.html` with the rendering moved behind callbacks); only
markup and CSS differ, so the chosen look can borrow another concept's layout cheaply.

To view them, serve a root that has the four sites side by side (the data paths are absolute: `/Anandadhara/songs.json`,
`/Raagmala/raagmala.json`, `/Piano/works.json`):

```
mkdir root && cd root
ln -s /path/to/surghor Surghor; ln -s /path/to/Anandadhara/docs Anandadhara
ln -s /path/to/raagmala/docs Raagmala; ln -s /path/to/piano/docs Piano
python3 -m http.server 8077      # then http://localhost:8077/Surghor/design/mockups/
```

Query overrides for testing: `?h=19` (hour), `?season=Barsha`, `?theme=dark`. `mockups/shots/` has headless-Chromium
screenshots: `{a,b,c}-home-phone.png` (375 wide, full page), `{a,b,c}-playing-phone.png` (after play, queue built),
`{a,b,c}-home-desktop.png` and `{a,b,c}-playing-desktop.png` (1200 wide), `{a,b,c}-home-dark-phone.png`, and the
app icons `{a,b,c}-icon.png` (512, rendered from `mockups/icons.html`). The shots were taken at 19:00 in Hemanta
(so the guess reads "এখন সন্ধ্যা, ঋতু হেমন্ত — আজ মনে হচ্ছে প্রেম"); YouTube was unreachable, so the embed is black.
Image credits are in `image-sources.md`.

Every concept has: the radio as the heart of the page (big 16:9 embed that is never covered, the mood line in warm
Bengali with an English echo, seven large mood choices, three source toggles, prev / play-pause / next / like / open-on-site,
the up-next queue with every track tagged by source), the three sites as three rooms, the hour and the season on
screen, Bengali first, light and dark via tokens on `:root` + `prefers-color-scheme` (+ a `data-theme` override and a
toggle), visible focus rings, `prefers-reduced-motion`, no horizontal scroll at 375 px, a two-column layout at 1200 px.

## The three concepts

- **A · বৈঠকখানা Baithakkhana — the sitting room of a paper house, in Tagore's palette.** The idea: Surghor is a warm house
  and the radio is its sitting room; the three sites are rooms off it. Palette: handmade paper `#f3e9d6`, card `#fbf6ec`,
  lamp-black ink `#2a2320`, dusty clay `#b5695a` as the house accent (hairlines, the play button, the mood line), and
  Tagore's painting colours for the seven mood tiles — sage `#6d7f5a` শান্ত, saffron `#c98a2a` ভক্তি, crimson `#8e2f3c`
  প্রেম, indigo `#2f3f6e` বিরহ, ochre `#c6922e` আনন্দ, sap green `#5f7a3a` প্রকৃতি, sienna `#a65a31` সাহস — with a faint
  luminosity-blend fragment of *Seven Figures* inside each tile. Type: Tiro Bangla (regular weight) for titles and the
  mood line, Hind Siliguri for UI, Fraunces italic for English. Ornament: one line-drawn alpona (brand mark, sky corner,
  Anandadhara room) and a hairline vine as the footer; a thin sky band across the top whose gradient and sun/moon
  position follow the hour. The rooms: Anandadhara is cream with Tagore's 1937 landscape fading in from the right and
  the alpona; Raagmala is lacquer plum `#3b2447` with a gold `#d9b254` swara mandala (সা রে গ ম প ধ নি) and a gold
  hairline; Piano is ivory `#faf7f0` with a CSS keyboard rule and viridian `#2f7a63`. The radio: a cream card; before
  play the stage shows the landscape painting with a clay play disc; after play the embed, the now-playing line with a
  source tag, five square controls (the play/pause one in clay), the 2×4 mood tiles, source pills, and the queue with
  small round "রবি / রাগ / পিয়ানো" badges (a side column on desktop). Dark mode is night paper (`#1e1916`) with a
  lighter clay. Screenshots: `a-*.png`; icon: cream square, a clay gable roof over "সু", three room-coloured dots.
- **B · আকাশ Akash — the sky over the house.** The idea: the hour and the Bengali season paint the whole page, so Surghor
  looks different at dawn and at night, in Barsha and in Sheet. Palette: a neutral shell (`#f5f0e8` page, white cards,
  ink `#23212b`) under a hero sky whose two gradient stops and the accent colour come from the hour (dawn `#f7d4c0→#d9a7b5`,
  morning `#bfe0f2→#e9f0e4`, noon `#9ccbe8→#f1e9c9`, afternoon `#f3c98a→#e5b07a`, evening `#e8a89a→#5b4a7a`, night
  `#1e2746→#3d3a63`) and a ground whose colour and drawn motif come from the season (rain and kadam for Barsha, kash for
  Sharat, ripe paddy for Hemanta, mustard and mist for Sheet, palash for Basanta, krishnachura for Grishma), with the
  three-roofed house in silhouette. Mood tiles are two-stop gradients (শান্ত `#8fb3a6→#4f7f72`, ভক্তি `#f0b55a→#c47a1a`,
  প্রেম `#e07d93→#9b2f4e`, বিরহ `#6f7fbf→#2c386e`, আনন্দ `#f6c35a→#d98a1e`, প্রকৃতি `#8ec06a→#45803a`, সাহস
  `#e28a63→#a84a2c`). Type: Noto Serif Bengali 600/700 for display, Hind Siliguri for UI, Inter for English. Ornament:
  the drawn scene only. The rooms are three arched doorways with a "fanlight" showing each site's mark — a line alpona on
  cream for Anandadhara, a gold swara mandala on lacquer for Raagmala, a drawn keyboard with "PROGRAMME" on paper for
  Piano. The radio: a white card that overlaps the bottom of the sky; the mood line sits in the sky in large serif; the
  embed is at the top of the card, then the title with a source tag, round controls with a big accent play button, a
  horizontal ribbon of mood tiles (a 4-wide grid on desktop), a segmented source control and the queue with colour bars.
  Dark mode is the same sky at night on an indigo-grey shell (`#171622`). Screenshots: `b-*.png`; icon: dusk-sky disc, a
  white "সু", a small moon and the golden ground.
- **C · বেতার Betar — the valve radio in the drawing room.** The idea: the mood radio is literally a radio set, the
  kind that stood in a Bengali বৈঠকখানা in the 1950s, and the three sites are records on the shelf beneath it. Palette:
  bakelite cream `#efe6d2` / face `#f6efdf`, walnut `#5b3a2e` and `#7a5240`, brass `#b08d3f` / `#d9b254`, one red
  needle `#c23b22`, ink `#2b2420`; the mood dots and the sleeves use the same Tagore/lacquer/viridian colours as A. Type:
  Noto Serif Bengali 600/700, Hind Siliguri for the dial and buttons, Fraunces italic for the nameplate and English.
  Ornament: the tuning dial (a brass scale with the six parts of the day as the station names and a red needle that
  rests on the guessed mood and moves when you tap another), the brass rim of the screen, the speaker-cloth pattern
  before play, push-button "bands" for the three sources (রবি / রাগ / পিয়ানো), brass knobs for the controls, and the
  queue set as "আজকের অনুষ্ঠানসূচি", a Betar Jagat-style programme sheet with numbered items. The rooms are three square
  record sleeves on a walnut shelf: Anandadhara in cream with *Bird Fantastic* showing through and an alpona, Raagmala in
  lacquer with the gold mandala, Piano in paper with the keyboard rule along the bottom edge. Dark mode is the same set
  by lamplight (walnut `#1c1512`, brass brighter). Screenshots: `c-*.png`; icon: a walnut rounded square, a cream dial
  with a brass rim and "সু", a red needle mark on the rim.

## Recommendation

**A · বৈঠকখানা**, taking B's one idea that A lacks: let the sky band grow a little on the phone and carry B's drawn
season motif (kash, rain, paddy, mustard, palash) so that the page changes through the year.

Why A: it is the concept that most directly answers the owner's taste as recorded on Anandadhara — warm, soft, colourful
without a single stark block, Tagore's own palette doing the work, alpona used once and lightly — and it is the only one
of the three that reads as "the same family" as the three sister sites without copying any of them: the Anandadhara room
is plainly Anandadhara, the Raagmala room is plainly Chitra, the Piano room is plainly Programme, and the cream house
around them is its own thing. Its radio is the most legible on a phone (the guess line, the painting stage and the 2×4
tiles fit one screen, every control has a Bengali label) and it is the calmest to live with as a home screen that will be
opened many times a day. B is the most alive and the most app-like, and its season scene is the thing people will
remember, but its neutral white card and gradient tiles feel like a generic music app once the sky is scrolled away,
and its arched doors are the weakest "rooms". C is the most distinctive object and the dial-with-needle is the best
expression of "the radio guessed, turn it if you like", but a radio set is a joke that has to be told every time the
page opens, its walnut frame is heavy on a phone, and the owner has already said no to heavy iconography; keep its needle
idea for the mood row if A ever needs a stronger "আজকের" marker.

## Notes for the final build

- `common.js` keeps the live page's logic exactly (moods, cut-offs, weights, learning, memory key `surghor.v1`) with
  two behaviour changes worth keeping: the queue renders immediately and the IFrame API is loaded without blocking, so
  the page is usable even when YouTube is slow or absent, and the YouTube API's `onReady` loads the current track.
- The `#yt` div and the 16:9 stage are in the DOM from the start (a painting / sky / speaker cloth covers it until play),
  so nothing ever moves under the embed when it appears.
- The hour and season overrides (`?h=`, `?season=`) are for testing only and should be dropped from the real page.
- The icons in `shots/*-icon.png` are rendered at 512; the maskable variant needs the same artwork with 20% extra
  padding, and the Piano/Raag/Tagore colour dots in icon A should stay at least 16 px at 512 to survive 48 px.
