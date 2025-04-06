import { PokemonGeneration } from "./PokemonGenerations";

export const TOTAL = 1010;
export const generationRanges: Record<number, [number, number]> = {
  1: [1, 151], // Kanto
  2: [152, 251], // Johto
  3: [252, 386], // Hoenn
  4: [387, 493], // Sinnoh
  5: [494, 649], // Unova
  6: [650, 721], // Kalos
  7: [722, 809], // Alola
  8: [810, 898], // Galar
  9: [899, TOTAL] // Paldea (pode crescer com atualizações)
}

export const generations = [
  { label: "Todos", value: null },
  { label: "Kanto", value: 1 },
  { label: "Johto", value: 2 },
  { label: "Hoenn", value: 3 },
  { label: "Sinnoh", value: 4 },
  { label: "Unova", value: 5 },
  { label: "Kalos", value: 6 },
  { label: "Alola", value: 7 },
  { label: "Galar", value: 8 },
  { label: "Paldea", value: 9 }
];


export const getPokemonFormattedId = (id: number | undefined) : string => {
  if (id === 0) return "#0";
  return `#${id}`;
}

export const getPokemonId = (url: string | undefined): number => {
  if (!url) return 0;
  return parseInt(url.split("/")[6]);
}

export const getPokemonGeneration = (id: number): PokemonGeneration => {
  for (const [generation, range] of Object.entries(generationRanges)) {
    if (id >= range[0] && id <= range[1]) {
      return parseInt(generation) as PokemonGeneration;
    }
  }
  return PokemonGeneration.KANTO;
}
