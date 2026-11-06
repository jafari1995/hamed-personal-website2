/** Stable 0–5 tone so missing-image covers vary without looking random. */
export function coverTone(seed: string): number {
  let n = 0;
  const value = seed || "story";
  for (let i = 0; i < value.length; i += 1) {
    n = (n + value.charCodeAt(i) * (i + 1)) % 6;
  }
  return n;
}
