import { Pokemon } from "src/domain/model/Pokemon";

export interface IPokemonRepository {
  getPokemons: (limit: number) => Promise<Pokemon[]>;
  getPokemonDetails: (name: string) => Promise<Pokemon>;
};
