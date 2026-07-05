/**
 * Generates deterministic HSL color values based on the hash of a string.
 * This guarantees the same tag always gets the same color palette,
 * while ensuring proper contrast between text, background, and borders.
 */
export const getTagStyles = (tag: string) => {
  const normalized = tag.toLowerCase().trim();

  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Determine hue (0 - 360)
  const hue = Math.abs(hash) % 360;

  return {
    backgroundColor: `hsl(${hue}, 75%, 96%)`,
    color: `hsl(${hue}, 85%, 22%)`,
    borderColor: `hsl(${hue}, 60%, 88%)`,
  };
};
