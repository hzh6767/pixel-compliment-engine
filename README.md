# Pixel Compliment Engine

An offline pixel-style compliment machine. Pick a flavor, enter a handle, and earn a score for every kind message generated.

Open `index.html` directly in a browser. It has no dependencies, network calls, build tools, or API keys. The session score is intentionally ephemeral.

## Features

**Power-up flavors** — four banks of hand-written templates:

- `CREATIVE CRAFT` — the craft bank, for makers and tinkerers
- `BOLD MOVES` — the brave bank, for courage under boss music
- `KIND ENERGY` — the kind bank, for the party's healer
- `CHAOTIC GOOD` — the chaos bank, for the delightful wildcard

**Scoring** — every generated compliment is worth a random 50-99 points. The session score adds them up and the bar under it fills toward 1000 points. `COMBO` counts how many compliments you have generated this session.

**Rarity tiers** — the tier shown next to the compliment comes from that single compliment's points:

| Points | Tier |
| --- | --- |
| 50-65 | NICE |
| 66-85 | RARE |
| 86-99 | ULTRA RARE |

`MAXIMUM NICE ACHIEVED` is the best single compliment rolled this session, so it only moves when you beat your own high roll.

## Manual check

1. Enter a handle and press GENERATE PRAISE. The compliment appears, the score grows, `COMBO` increments, and the rarity tier matches the table above.
2. Press COPY. The label flips to `COPIED!` and back to `COPY`.
3. If the browser blocks clipboard access, the label reads `SELECT TEXT` for a moment and the compliment is selected for you to copy by hand. Pressing COPY again retries.

## Tests

The pure logic (banks, template fill, rarity thresholds) lives in `app.js` and is exercised in Node:

```
npm test
```

## License

MIT. See `LICENSE`.
