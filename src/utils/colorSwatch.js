const defaultPalette = [
  "bg-rose-100",
  "bg-amber-100",
  "bg-lime-100",
  "bg-emerald-100",
  "bg-cyan-100",
  "bg-sky-100",
  "bg-indigo-100",
  "bg-violet-100"
];

export function getColorClass(value = "", palette = defaultPalette) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return palette[Math.abs(hash) % palette.length];
}
