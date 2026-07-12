# The Road That Gave Me a Sister — V3 Fixed

## Important changes

- Preserves the exact current `JOURNEY` coordinates and content.
- The car memory is not a destination or coordinate.
- Click the car while it is stopped to open its photos/videos/voice notes.
- The car follows OSRM road geometry without skipping corners.
- Movement is deliberately slower.
- The two faces pop out while the car moves.
- Active and completed roads use two visible line layers for a proper glow.
- Smart Living PG has a dedicated Home finale.
- Chapter Two appears after the Home finale.

## Run

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Car faces

Add these exact files:

```text
assets/photos/me-face.png
assets/photos/sister-face.png
```

## Important cache note

This version uses a new `route-v3` cache key. Old incorrect browser routes will not be reused.

To fully reset route data anyway, open DevTools → Application → Local Storage and clear the site storage.

## Media

Continue editing only `memories.js`.
