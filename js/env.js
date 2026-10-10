// Shared environment flags
export const CALM = matchMedia('(prefers-reduced-motion: reduce)').matches;          // user asked for less motion
export const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;       // has a real mouse
