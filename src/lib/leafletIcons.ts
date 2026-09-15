// Vite doesn't resolve Leaflet's default marker image paths automatically —
// this rewires them to the bundled asset URLs. Import this once, anywhere,
// before rendering a <MapContainer>.
import L from 'leaflet'
import icon2x from 'leaflet/dist/images/marker-icon-2x.png'
import icon from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'

// Without this, Leaflet auto-detects an "images/" base path from its own CSS
// and prefixes it onto the absolute URLs below, doubling the path.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: shadow,
})
