Personalized Assignment Add-on: Fantasy RPG Map Version

Create a classic tabletop RPG world map: parchment background, coastlines, mountains, forests, a kingdom/city, and a marked quest route leading to a final destination (ruins/dragon lair/ancient temple).

What to Draw (Concrete Checklist)
1) Parchment + Border

Big parchment rectangle with a warm tan fill.

Add an ornate border: a frame made of rect() + corner triangles.

Optional aging: darker edges by layering semi-transparent rects.

2) Coastline + Ocean

Make the ocean a big blue-ish area (rect() or large quad()).

Build the landmass as an irregular “blob” using overlapping circles/ellipses and/or quad() shapes.

Add coastline accents: a darker stroke around land; optional tiny “wave” arcs near shore.

3) Mountain Range (Icon style)

Use repeated triangle()s for mountains.

Add snowcaps: smaller white triangles on top.

Vary size to suggest depth (bigger foreground, smaller background).

4) Forest

Use repeated tree icons:

trunk: tiny rect()

canopy: triangle() or circle()

Cluster them into a recognizable forest region.

5) Rivers + Lake

A river made from connected short line() segments (or narrow rectangles).

A lake using ellipse() with a darker outline.

6) A Settlement + Roads

A capital city icon: small rect() buildings + a triangle() roof, or a simple castle silhouette.

Roads: thin line()s leading to 1–2 other locations.

7) Quest Route + “X”

A dotted/dashed route line across the map (repeating line() segments).

End at a destination with:

a bold X (two thick lines)

optional skull/ruins icon (shapes only)

8) Compass Rose + Title Text

Compass rose: triangles + lines, placed in a corner.

Add a map title with text(), like:

“Kingdom of Eldermere”

“The Shattered Coast”

“Realm of Thornvale”

9) Labels (At least 5)

Use text() to label regions, like:

“Frostpeak Mountains”

“Wyrmwood”

“Silverlake”

“Redgate Keep”

“Ruins of Azh’Tor”

Color Palette Suggestion (Easy & RPG-ish)

Parchment: tan / beige

Ink lines: dark brown

Ocean: desaturated blue/teal

Mountains: gray + white

Forest: deep green

Route + X: dark red or black

Extra Challenge Options (Pick 1–2)

Legend box: icons + labels (tree = forest, triangle = mountains, etc.)

Map scale bar (“0 — 50 — 100 miles”)

Fog-of-war effect: translucent gray shapes hiding an area

Sea monsters or ships in the ocean (built from shapes)