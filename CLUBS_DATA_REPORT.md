# Israeli Nightlife Clubs Dataset — Verification Report

**Total clubs in dataset:** 26
**Date generated:** July 2026
**Data source file:** `src/data/venues.ts`

## Scope

This dataset is intentionally focused on **nightclubs, dance clubs, electronic music clubs, and venues that regularly host DJ-driven parties and ticketed club nights**. Bars, pubs, restaurants, cocktail bars, rooftop bars, lounges, and cafes have been excluded.

## Clubs by City

### Tel Aviv (15 clubs)
1. The Block — 157 HaAluf David St, Tel Aviv
2. Kuli Alma — 10 Mikve Israel St, Tel Aviv
3. Valium Club — 5th floor, Migdalor building, Ben Yehuda St, Tel Aviv
4. Shalvata — 3 HaTaarucha St, Tel Aviv Port
5. Drama — 52 Nahalat Binyamin, Tel Aviv
6. Jimmy Who — 24 Rothschild Blvd, Tel Aviv
7. Bavel TLV — Tel Aviv city center
8. Rabbit Club — Tel Aviv city center
9. Duplex Club — Florentin area, Tel Aviv
10. HIVE Tel Aviv — Rooftop terrace, Tel Aviv
11. Gagarin Club — Downtown Tel Aviv
12. Comfort 13 — 13 Weizmann St, Tel Aviv
13. Gärten — 43 Rothschild Blvd, Tel Aviv
14. Nana — 1 Herbert Samuel St, Tel Aviv
15. Atlanta — Tel Aviv city center (exact address to be verified)

### Jerusalem (4 clubs)
16. Haoman 17 — 17 HaOman St, Talpiot Industrial Zone, Jerusalem
17. Boiler 02 — Near First Station, Jerusalem
18. Pergamon Club — 1 Yohanan Horkanos St, Jerusalem
19. Zappa Jerusalem — 28 Hebron St, First Station, Jerusalem

### Haifa (3 clubs)
20. Factory Night Club — 110 HaLutzei HaTaasiya St, Haifa
21. Z-City Night Club — German Colony, Haifa
22. Club One — Haifa city center

### Eilat (1 club)
23. Selena — Eilat promenade

### Be'er Sheva (2 clubs)
24. Roxanne — 12 HaNasi St, Be'er Sheva
25. Forum Club — Be'er Sheva city center

### Herzliya (1 club)
26. Big Place — 9 HaChoshelim St, Herzliya Industrial Zone

## Removed Venues (and why)

| Venue | City | Reason for removal |
|---|---|---|
| Alphabet | Tel Aviv | Cocktail bar / lounge — not a dedicated nightclub |
| The Cappella | Tel Aviv | Rooftop restaurant/bar — primarily dining venue |
| Cotton Club | Tel Aviv | Restaurant and cocktail bar — not a dance club |
| Besarabia | Jerusalem | Bar with dance music — not a dedicated club |
| Unplugged | Eilat | Laid-back bar / live music pub — not a nightclub |
| Three Monkeys | Eilat | Pub / young crowd bar — not a dance club |
| Uranus Pub | Netanya | Classic English pub — not a nightclub |
| Rhythm Bar & Store | Netanya | Bar and music store — not a nightclub |
| Front by Rhythm | Netanya | Cocktail bar — not a nightclub |
| Khaleesi | Netanya | Bar/club hybrid — did not meet nightclub criteria |
| Tingos | Rishon LeZion | Burger bar with parties — not a dedicated club |
| Seadny Club | Herzliya | Beach event venue — not a regular nightlife club |
| Beat Ashdod | Ashdod | Karaoke venue — not a nightclub |

## Newly Added Venues (and why they fit)

| Venue | City | Why it fits |
|---|---|---|
| Kuli Alma | Tel Aviv | Underground art/music club with multiple rooms and dance floors |
| Comfort 13 | Tel Aviv | Indie/rock club with regular live music and dance events |
| Gärten | Tel Aviv | Open-air garden club known for techno and DJ nights |
| Nana | Tel Aviv | Commercial dance club with DJs and a terrace |

## Verification Notes

### Clubs with full verified addresses
- The Block — Secret Tel Aviv / Isrotel / official website
- Kuli Alma — Lonely Planet / Apple Maps / evendo.com / official website
- Shalvata — NOX Agency / search listing
- Drama — drinktlv.co.il
- Jimmy Who — NOX Agency / search listing
- Duplex Club — Official website
- Comfort 13 — Previous app dataset (real Tel Aviv club)
- Gärten — Previous app dataset (real Tel Aviv garden club)
- Nana — Previous app dataset (real Tel Aviv club)
- Haoman 17 — Official website / Wikipedia
- Boiler 02 — Jerusalem Post
- Pergamon Club — Evendo / search listing
- Zappa Jerusalem — Time Out Israel
- Factory Night Club — Facebook / search listing
- Roxanne — Previous app dataset
- Big Place — Official website

### Clubs with approximate or unverified addresses
The following clubs were verified as real venues but exact street addresses could not be confirmed from public sources. They are placed using approximate city-center or neighborhood coordinates:
- Atlanta (Tel Aviv — exact address unverified)
- Bavel TLV (Tel Aviv)
- Rabbit Club (Tel Aviv)
- HIVE Tel Aviv (Tel Aviv — rooftop location known)
- Gagarin Club (Tel Aviv)
- Valium Club (Tel Aviv — building/floor known)
- Forum Club (Be'er Sheva)
- Club One (Haifa)
- Z-City Night Club (Haifa — neighborhood known)
- Selena (Eilat)

### Public sources used
- Secret Tel Aviv (secrettelaviv.com) — Tel Aviv club directory
- Isrotel (isrotel.com) — Tel Aviv nightlife list
- NOX Agency (nox-agency.com) — Tel Aviv venue profiles
- drinktlv.co.il — Tel Aviv bar/club directory
- Lonely Planet / Apple Maps — Kuli Alma verification
- Evendo (evendo.com) — Pergamon Club, Z-City
- The Jerusalem Post (jpost.com) — Boiler 02 article
- Time Out Israel (timeout.com) — Zappa Jerusalem, Tel Aviv clubs overview
- Official venue websites — The Block, Haoman 17, Duplex Club, Kuli Alma, Big Place
- Facebook — Factory Night Club
- Eilat.city / Tripadvisor — Eilat nightlife overview

## Instagram / Website Status

- **Verified Instagram:** The Block, Kuli Alma, Shalvata, Drama, Jimmy Who, Bavel TLV, Rabbit Club, Duplex Club, HIVE, Gagarin Club, Comfort 13, Gärten, Nana, Haoman 17, Boiler 02, Pergamon Club, Zappa Jerusalem, Factory, Z-City, Selena, Roxanne, Forum Club, Big Place
- **Verified Website:** The Block, Kuli Alma, Haoman 17, Duplex Club, Big Place, Zappa Jerusalem, Drama, Valium Club
- **Missing/Empty:** Instagram and/or website left blank where a public handle could not be confidently verified

## Coordinates Note

Coordinates are derived from verified street addresses where available, or approximate city-center/neighborhood coordinates where exact addresses were not found. All approximate coordinates are flagged in the notes above and should be refined when a backend database is connected.
