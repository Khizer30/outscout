export function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) {
    return "#FFFFFF";
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#0F172A" : "#FFFFFF";
}

export function isLightColor(hexColor: string): boolean {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) {
    return true;
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 160;
}
