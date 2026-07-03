# Venue Assets Guide

This guide explains how to add or update a nightlife venue/club in the app.

## How Logos Work

Until you add an official logo, every venue shows a **clean text-based initials circle** in the same avatar slot. For example:

- The Block → **TB**
- Kuli Alma → **KA**
- Valium Club → **VC**
- Shalvata → **SH**
- Drama → **DR**
- Jimmy Who → **JW**
- Haoman 17 → **H17**
- Boiler 02 → **B02**
- Factory Night Club → **FC**
- Selena → **SL**
- Roxanne → **R**
- Big Place → **BP**

When you add an official logo file, the initials are automatically replaced by the image everywhere (map marker, bottom card, and modal).

## Folder Structure

Official logos go here:

```
assets/venues/logos/
```

Expected filenames for the current venues:

```
assets/venues/logos/the-block.png        # The Block — Tel Aviv
assets/venues/logos/kuli-alma.png        # Kuli Alma — Tel Aviv
assets/venues/logos/valium-club.png     # Valium Club — Tel Aviv
assets/venues/logos/shalvata.png        # Shalvata — Tel Aviv
assets/venues/logos/drama.png            # Drama — Tel Aviv
assets/venues/logos/jimmy-who.png       # Jimmy Who — Tel Aviv
assets/venues/logos/bavel-tlv.png       # Bavel TLV — Tel Aviv
assets/venues/logos/rabbit-club.png     # Rabbit Club — Tel Aviv
assets/venues/logos/duplex-club.png     # Duplex Club — Tel Aviv
assets/venues/logos/hive-tel-aviv.png   # HIVE Tel Aviv — Tel Aviv
assets/venues/logos/gagarin-club.png   # Gagarin Club — Tel Aviv
assets/venues/logos/comfort-13.png      # Comfort 13 — Tel Aviv
assets/venues/logos/garten.png         # Gärten — Tel Aviv
assets/venues/logos/nana.png            # Nana — Tel Aviv
assets/venues/logos/atlanta.png         # Atlanta — Tel Aviv
assets/venues/logos/haoman-17.png       # Haoman 17 — Jerusalem
assets/venues/logos/boiler-02.png       # Boiler 02 — Jerusalem
assets/venues/logos/pergamon-club.png   # Pergamon Club — Jerusalem
assets/venues/logos/zappa-jerusalem.png # Zappa Jerusalem — Jerusalem
assets/venues/logos/factory-night-club.png # Factory Night Club — Haifa
assets/venues/logos/z-city.png          # Z-City Night Club — Haifa
assets/venues/logos/club-one.png        # Club One — Haifa
assets/venues/logos/selena.png          # Selena — Eilat
assets/venues/logos/roxanne.png         # Roxanne — Be'er Sheva
assets/venues/logos/forum-club.png     # Forum Club — Be'er Sheva
assets/venues/logos/big-place.png       # Big Place — Herzliya
```

## How to Add a Real Logo

### 1. Get the official logo

Only use logos from approved sources (the club's official website, social media, or material you have permission to use). **Do not scrape images from the internet.**

### 2. Place the file

Save the logo as a **square PNG** in `assets/venues/logos/`.

- Recommended size: 128×128px or 256×256px.
- Filename must match the venue's `logo` `require(...)` path in `src/data/venues.ts`.

Example: to add The Block's logo, save it as:

```
assets/venues/logos/the-block.png
```

### 3. Update the venue data

Open `src/data/venues.ts` and change the venue's `logo` field from `undefined` to the real file:

```typescript
{
  id: 1,
  name: 'The Block',
  city: 'Tel Aviv',
  // ... other fields ...
  initials: 'TB',
  logo: require('../../assets/venues/logos/the-block.png'),
  // ...
}
```

Keep the `initials` field — it is still used as the fallback if the logo is ever removed.

### 4. Verify it appears

1. Restart the Expo app:
   ```bash
   npx expo start --clear
   ```
2. Open the Map screen.
3. Confirm the logo appears in:
   - The **map marker**
   - The **bottom venue cards**
   - The **venue details modal**

## How to Add a New Club

1. Add the venue data to `src/data/venues.ts`.
2. Set `initials` (e.g., `XL` for a club called `X-Lounge`).
3. Leave `logo: undefined` until you have the official logo.
4. When you have the logo, save it to `assets/venues/logos/` and update the `logo` field with `require(...)`.
5. Restart the app and verify on the map and cards.

## Important Notes

- **No fake logos**: Do not add invented or placeholder image files. The app shows clean initials until you provide a real logo.
- **No crashes**: If `logo` is `undefined` or the image path is wrong, the app falls back to the `initials` circle. It will never crash.
- **No emojis**: The UI now uses logos or initials, never emojis.
- **Coordinates**: If exact coordinates are unavailable, use an approximate value and update it later.
- **Logo format**: PNG is recommended. JPG and WEBP are also supported by React Native.
- **Scope**: This app is for nightclubs, dance clubs, and DJ-driven venues. Do not add bars, pubs, restaurants, lounges, or cafes.

## How to Update an Existing Logo

1. Replace the PNG file in `assets/venues/logos/`.
2. Keep the same filename (e.g., `the-block.png`).
3. Clear the Expo cache and restart:

```bash
npx expo start --clear
```
