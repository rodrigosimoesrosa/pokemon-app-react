import "reflect-metadata";
import { injectable } from "inversify";
import { PokemonCache } from "src/data/cache/PokemonCache";
import { PokemonService } from "src/data/network/PokemonService";
import { IPokemonRepository } from "src/data/repository/IPokemonRepository";
import { logError } from "src/util/log";
import { Pokemon } from "src/domain/model/Pokemon";
import { getPokemonGeneration, getPokemonId, TOTAL } from "src/domain/usecase/PokemonConfig";

@injectable()
export class PokemonRepository implements IPokemonRepository {
    
  getPokemons = async (): Promise<Pokemon[]> => {
    try {
      const localPokemons = (await PokemonCache.getPokemons()) || {};
      const remotePokemons = (await PokemonService.fetchPokemons(TOTAL)) || [];

      return remotePokemons.map((pokemon) => {
        const id = getPokemonId(pokemon.url);
        const cached = localPokemons[pokemon.name];
        if (cached) {
          return {
            ...pokemon,
            image: cached.image,
            height: cached.height,
            weight: cached.weight,
            types: cached.types,
            id: id,
            generation: getPokemonGeneration(id),
          };
        } else {
          return {
            ...pokemon,
            id: id,
            generation: getPokemonGeneration(id),
          } as Pokemon;
        }
      });
    } catch (error) {
      logError(`Error in getPokemons: ${error}`);
      throw new Error('Failed to fetch pokemons');
    }
  };

  getPokemonDetails = async (name: string) => {
    try {
      const local = await PokemonCache.getPokemon(name);
      if (local) return local;
  
      const remote = await PokemonService.fetchPokemonDetails(name);
      if (remote) await PokemonCache.savePokemon(name, remote);
      
      return remote;
    } catch (error) {
      logError(`Error fetching Pokémon details: ${error}`);
      throw error;
    }
  };
}
