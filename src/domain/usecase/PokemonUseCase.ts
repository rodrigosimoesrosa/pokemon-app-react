import "reflect-metadata";
import { inject, injectable } from "inversify";
import type { IPokemonRepository } from "src/data/repository/IPokemonRepository";
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

  fetch = async (): Promise<Pokemon[]> => {
    try {
      return await this.repository.getPokemons();
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
