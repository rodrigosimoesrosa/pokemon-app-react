import { PokemonGeneration } from "../usecase/PokemonGenerations";

export interface Pokemon {
  url: string | undefined;
  name: string;
  image: string | undefined;
  types: string[] | undefined;
  height: number | undefined;
  weight: number | undefined;
  id: number;
  generation: PokemonGeneration | undefined;
}
