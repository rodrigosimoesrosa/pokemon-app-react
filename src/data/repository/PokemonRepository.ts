import "reflect-metadata";
import { injectable } from "inversify";
import { PokemonCache } from "src/data/cache/PokemonCache";
import { PokemonService } from "src/data/network/PokemonService";
import { IPokemonRepository } from "src/data/repository/IPokemonRepository";

@injectable()
export class PokemonRepository implements IPokemonRepository {
    
  getPokemons = async (limit: number = 151) => {
    let localPokemons = await PokemonCache.getPokemons() || {};
    let remotePokemons = await PokemonService.fetchPokemons(limit) || [];
    
    remotePokemons.forEach((pokemon) => {
      let cachedPokemon = localPokemons[pokemon.name];
      if (cachedPokemon) {
        pokemon.image = cachedPokemon.image;
        pokemon.height = cachedPokemon.height;
        pokemon.weight = cachedPokemon.weight;
        pokemon.types = cachedPokemon.types;
      }
    });
    
    return remotePokemons;
  };

  getPokemonDetails = async (name: string) => {
    const localPokemon = await PokemonCache.getPokemon(name);
    if (localPokemon) return localPokemon;

    let remotePokemon = await PokemonService.fetchPokemonDetails(name);
    if (remotePokemon) {
      await PokemonCache.savePokemon(name, remotePokemon);
    }
    
    return remotePokemon;
  };
}
