// Dummy coordinates for the NT place names used in supabase/seed.sql.
// The data dictionary's TOURISM_CONTENT has no lat/lng columns, so this is a
// local lookup rather than a schema change — good enough to plot a prototype
// map. Swap for real geocoded coordinates (or add lat/lng columns) later.
const KNOWN_LOCATIONS: Record<string, [number, number]> = {
  'Red Centre': [-25.3444, 131.0369], // Uluru
  Kakadu: [-12.6524, 132.8329],
  Litchfield: [-13.1725, 130.7917],
  'Darwin CBD': [-12.4634, 130.8456],
  'Mindil Beach': [-12.4508, 130.8272],
  Katherine: [-14.4652, 132.2635],
  'Adelaide River': [-13.2417, 131.1067],
  Parap: [-12.4192, 130.8583],
}

const DARWIN_DEFAULT: [number, number] = [-12.4634, 130.8456]

/**
 * Looks up dummy coordinates for a location name. `occurrence` is how many
 * earlier items in the same list already resolved to this exact location —
 * pass an increasing count per repeat so duplicate stops (or unmapped
 * locations sharing the Darwin fallback) fan out instead of stacking on one
 * marker.
 */
export function coordsFor(location: string | null, occurrence = 0): [number, number] {
  const base = (location && KNOWN_LOCATIONS[location]) || DARWIN_DEFAULT
  const jitter = 0.015 * occurrence
  return [base[0] + jitter, base[1] + jitter]
}
