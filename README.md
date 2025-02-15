# quadwrangler 🪟

Ultra-minimal window snapping extension for GNOME, inspired by [Rectangle][rectangle] and
[Magnet][magnet] for MacOS.

## Features

- [x] Snap to pre-defined regions, with configurable shortcuts.
- [x] Dragged windows restore to their original size.
- [ ] View shortcuts from a tray icon.

## Building

Prerequisites:

- NodeJS + npm
- `glib-compile-schemas`
- `gnome-extensions`
- `zip`

Pack + install from source:

```bash
npm run deploy
```

Run a nested GNOME shell (Wayland only):

```bash
npm run dev
```

See [package.json](package.json) for more info.

[rectangle]: https://rectangleapp.com/
[magnet]: https://magnet.crowdcafe.com/
