# Audio assets

## `patriot.mp3`

Background music for the **"4547" easter egg** ([`src/components/PatriotEasterEgg.tsx`](../../src/components/PatriotEasterEgg.tsx)).

The easter egg looks for `/audio/patriot.mp3`. If the file is missing, audio fails silently and the visual easter egg still works.

### Public-domain suggestions (all pre-1928, safe to use)

- **"The Star-Spangled Banner"** — Francis Scott Key, 1814 (lyrics) / John Stafford Smith, 1773 (melody)
- **"America the Beautiful"** — Katharine Lee Bates, 1893 / Samuel A. Ward, 1882
- **"Battle Hymn of the Republic"** — Julia Ward Howe, 1861
- **"Yankee Doodle"** — traditional, 1755
- **"My Country, 'Tis of Thee"** — Samuel Francis Smith, 1831

### Where to get clean recordings

- **musopen.org** — public-domain and CC-licensed classical/patriotic recordings
- **Library of Congress National Jukebox** — historical US recordings, many public domain
- **archive.org** — search "public domain patriotic"
- **YouTube Audio Library** — US-government-recorded performances (United States Marine Band etc.) are often public domain

### Requirements

- Format: MP3 (AAC/M4A also works if you prefer; update the `src` attribute in `PatriotEasterEgg.tsx`)
- Length: the egg runs 30 seconds then fades out; anything 30s+ is fine (it loops while active)
- Keep the file under 1 MB if possible — it's preloaded lazily but bandwidth still counts
- Verify the specific recording is public domain, not just the composition
