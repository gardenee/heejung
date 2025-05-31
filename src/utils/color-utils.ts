export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

export const getBrighterColor = (hex: string, factor: number): string => {
  const rgb = hexToRgb(hex);
  const newR = rgb.r + (255 - rgb.r) * factor;
  const newG = rgb.g + (255 - rgb.g) * factor;
  const newB = rgb.b + (255 - rgb.b) * factor;
  return rgbToHex(newR, newG, newB);
};

export const getDarkerColor = (hex: string, factor: number): string => {
  const rgb = hexToRgb(hex);
  const newR = rgb.r * (1 - factor);
  const newG = rgb.g * (1 - factor);
  const newB = rgb.b * (1 - factor);
  return rgbToHex(newR, newG, newB);
};
