import { PokemonRepository } from "src/data/repository/PokemonRepository";

export const PokemonsUseCase = {
  fetch: async () => {
    return await PokemonRepository.getPokemons();
  },
  details: async (name: string) => {
    return await PokemonRepository.getPokemonDetails(name);
  }
};
