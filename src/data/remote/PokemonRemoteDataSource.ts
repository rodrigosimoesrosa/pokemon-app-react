import "reflect-metadata";
import { injectable } from "inversify";
import { IPokemonRemoteDataSource } from "./IPokemonRemoteDataSource";
import { Pokemon } from "src/domain/model/Pokemon";
import { logError } from "src/util/log";

const API_URL = "https://pokeapi.co/api/v2/pokemon";

@injectable()
export class PokemonRemoteDataSource implements IPokemonRemoteDataSource {
  async fetchPokemons(limit: number = 151): Promise<Pokemon[]> {
    try {
      const response = await fetch(`${API_URL}?limit=${limit}`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      logError(error);
      return [];
    }
  }

  async fetchPokemonDetails(name: string): Promise<Pokemon | null> {
    try {
      const url = `${API_URL}/${name.toLowerCase()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar detalhes do Pokémon");

      const data = await response.json();
      return {
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        types: data.types.map((t: any) => t.type.name),
        height: data.height,
        weight: data.weight,
      } as Pokemon;
    } catch (error) {
      logError(error);
      return null;
    }
  }
}