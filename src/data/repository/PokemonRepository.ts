import "reflect-metadata";
import { inject, injectable } from "inversify";
import { IPokemonRepository } from "src/data/repository/IPokemonRepository";
import type { IPokemonRemoteDataSource } from "src/data/remote/IPokemonRemoteDataSource";
import type { IPokemonLocalDataSource } from "src/data/local/IPokemonLocalDataSource";
import { logError } from "src/util/log";
import { Pokemon } from "src/domain/model/Pokemon";
import { getPokemonGeneration, getPokemonId, TOTAL } from "src/domain/usecase/PokemonConfig";
import { TYPES } from "src/di/type";

@injectable()
export class PokemonRepository implements IPokemonRepository {
  constructor(
    @inject(TYPES.IPokemonRemoteDataSource)
    private remoteDataSource: IPokemonRemoteDataSource,
    @inject(TYPES.IPokemonLocalDataSource)
    private localDataSource: IPokemonLocalDataSource
  ) {}

  getPokemons = async (): Promise<Pokemon[]> => {
    try {
      const localPokemons = (await this.localDataSource.getPokemons()) || {};
      const remotePokemons = (await this.remoteDataSource.fetchPokemons(TOTAL)) || [];

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

  getPokemonDetails = async (name: string): Promise<Pokemon | null> => {
    try {
      const local = await this.localDataSource.getPokemon(name);
      if (local) return local;
  
      const remote = await this.remoteDataSource.fetchPokemonDetails(name);
      if (remote) await this.localDataSource.savePokemon(name, remote);
      
      return remote;
    } catch (error) {
      logError(`Error fetching Pokémon details: ${error}`);
      throw error;
    }
  };
}
