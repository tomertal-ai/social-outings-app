# Venue Assets Guide

This guide explains how to add or update a nightlife venue/club in the app.

## Folder Structure

All venue logos are stored in:

```
assets/venues/logos/
```

Current placeholder and example logos:

```
assets/venues/logos/placeholder.png      # fallback logo
assets/venues/logos/the-block.png        # The Block — Tel Aviv
assets/venues/logos/haoman-17.png        # Haoman 17 — Jerusalem
assets/venues/logos/alphabet.png         # Alphabet — Tel Aviv
assets/venues/logos/roxanne.png          # Roxanne — Be'er Sheva
assets/venues/logos/atlanta.png         # Atlanta — Tel Aviv
```

## How to Add a New Club

### 1. Add the logo image

- Place the official club logo in `assets/venues/logos/`.
- Use a **square** PNG (recommended size: 128×128px or 256×256px).
- The filename should match the venue slug in the data file (see step 2).
- Example: for a club called `Mirage`, save the logo as:
  ```
  assets/venues/logos/mirage.png
  ```

### 2. Add the venue data

Open the venue data file:

```
src/data/venues.ts
```

Add a new object to the `venues` array. Example:

```typescript
{
  id: 6,
  name: 'Mirage',
  city: 'תל אביב',
  address: 'רחוב הירקון 1, תל אביב',
  latitude: 32.0853,
  longitude: 34.7710,
  logo: require('../../assets/venues/logos/mirage.png'),
  description: 'מועדון חדש בתל אביב עם מוזיקה אלקטרונית.',
  rating: 4.2,
  priceRange: '₪50-100',
  instagram: 'https://www.instagram.com/mirage_tlv/',
  website: '',
  ticketLink: '',
  music: ['טכנו', 'האוס'],
  minAge: 21,
  entryPrice: '₪50-100',
  capacity: 600,
  openDays: 'ה׳-ש׳',
  hours: '23:00 - 06:00',
  color: '#7c3aed',
  tags: ['מועדון חדש', 'אלקטרו', 'תל אביב'],
},
```

### 3. Match the filename

Make sure the `require(...)` path points exactly to the logo file you added.

```typescript
logo: require('../../assets/venues/logos/mirage.png'),
```

### 4. Verify it appears

1. Restart the Expo app (`npx expo start` or reload the simulator).
2. Open the Map screen.
3. Confirm the new venue appears:
   - On the **map marker** (small logo + club name)
   - In the **bottom venue cards**
   - In the **venue details modal**

## Important Notes

- **Placeholder**: If a venue's `logo` field is missing or invalid, the app automatically shows `assets/venues/logos/placeholder.png`. The app will not crash.
- **No emojis**: Venue cards and markers now use real logo images instead of emojis.
- **Coordinates**: If you don't have exact coordinates, use an approximate location and mark it with a comment. Update it later.
- **Approved sources only**: Use official logos from the club's website, social media, or materials you have permission to use. Do not scrape images without permission.
- **Logo format**: PNG is recommended. JPG and WEBP are also supported by React Native.

## How to Update an Existing Logo

1. Replace the PNG file in `assets/venues/logos/`.
2. Keep the same filename (e.g., `the-block.png`).
3. Clear the Expo cache or restart the app.

```bash
npx expo start --clear
```
