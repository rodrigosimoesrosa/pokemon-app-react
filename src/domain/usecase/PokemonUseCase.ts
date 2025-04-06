import "reflect-metadata";
import { inject, injectable } from "inversify";
import { IPokemonRepository } from "src/data/repository/IPokemonRepository";
import { TYPES } from "src/di/type";
import { Pokemon } from "src/domain/model/Pokemon";
import { logError } from "src/util/log";

@injectable()
export class PokemonUseCase {
  private repository: IPokemonRepository;
  constructor(
    @inject(TYPES.IPokemonRepository) 
    repo: IPokemonRepository
  ) {
    this.repository = repo;
  }

  fetch = async (limit: number = 151): Promise<Pokemon[]> => {
    try {
      return await this.repository.getPokemons(limit);
    } catch (error) {
      logError(`Error in PokemonUseCase.fetch: ${error}`);
      throw new Error('Failed to fetch pokemons');
    }
  };

  details = async (name: string): Promise<Pokemon> => {
    try {
      return await this.repository.getPokemonDetails(name);
    } catch (error) {
      logError(`Error in PokemonUseCase.details: ${error}`);
      throw new Error(`Failed to fetch details for ${name}`);
    }
  };
}
