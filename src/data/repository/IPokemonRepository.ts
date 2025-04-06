import { Pokemon } from "src/domain/model/Pokemon";

export interface IPokemonRepository {
  getPokemons: () => Promise<Pokemon[]>;
  getPokemonDetails: (name: string) => Promise<Pokemon>;
};
