const EQUATOR_METERS_PER_PIXEL_AT_ZOOM_0 = 156543.03392;
const VIEWPORT_RADIUS_PIXELS = 300;
const MIN_RADIUS_METERS = 1;
const MAX_RADIUS_METERS = 50000;

export function zoomToRadiusMeters(lat: number, zoom: number): number {
  const metersPerPixel = (EQUATOR_METERS_PER_PIXEL_AT_ZOOM_0 * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom;
  const radius = Math.round(metersPerPixel * VIEWPORT_RADIUS_PIXELS);

  return Math.min(MAX_RADIUS_METERS, Math.max(MIN_RADIUS_METERS, radius));
}
