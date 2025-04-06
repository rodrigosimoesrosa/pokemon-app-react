import "reflect-metadata";
import { create } from 'zustand';
import { Pokemon } from 'src/domain/model/Pokemon';
import { logError } from 'src/util/log';
import { getPokemonUseCase } from "src/di/container";

type PokemonStore = {
  pokemons: Pokemon[];
  fetchPokemons: () => Promise<void>;
  fetchPokemonDetails: (name: string) => Promise<Pokemon | null>;
  updatePokemon: (pokemon: Pokemon) => void;
};

const useCase = getPokemonUseCase();
const usePokemonStore = create<PokemonStore>((set) => ({
  pokemons: [],
  fetchPokemons: async () => {
    try {
      const data = await useCase.fetch();
      set({ pokemons: data });
    } catch (error) {
      logError(`Failed to fetch pokemons: ${error}`);
    }
  },
  fetchPokemonDetails: async (name: string) => {
    try {
      const pokemon = await useCase.details(name);
      set((state) => ({
        pokemons: state.pokemons.map(p => 
          p.name === pokemon.name ? { ...p, ...pokemon } : p
        )
      }));
      return pokemon;
    } catch (error) {
      logError(`Failed to fetch pokemon details:${error}`);
      return null;
    }
  },
  updatePokemon: (pokemon: Pokemon) => {
    set((state) => ({
      pokemons: state.pokemons.map(p =>
        p.name === pokemon.name ? { ...p, ...pokemon } : p
      )
    }));
  }
}));

export default usePokemonStore;