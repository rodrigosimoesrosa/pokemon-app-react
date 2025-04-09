import "reflect-metadata";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { injectable } from "inversify";
import { IPokemonLocalDataSource } from "./IPokemonLocalDataSource";
import { Pokemon } from "src/domain/model/Pokemon";
import { logError } from "src/util/log";

const CACHE_KEY = "POKEMON_CACHE";

@injectable()
export class PokemonLocalDataSource implements IPokemonLocalDataSource {
  async getPokemons(): Promise<Record<string, Pokemon> | null> {
    try {
      const cache = await AsyncStorage.getItem(CACHE_KEY);
      if (!cache) return null;

      return JSON.parse(cache);
    } catch (error) {
      logError(error);
      return null;
    }
  }

  async getPokemon(name: string): Promise<Pokemon | null> {
    try {
      const cache = await AsyncStorage.getItem(CACHE_KEY);
      if (!cache) return null;

      const parsedCache = JSON.parse(cache);
      return parsedCache[name] || null;
    } catch (error) {
      logError(error);
      return null;
    }
  }

  async savePokemon(name: string, data: Pokemon): Promise<void> {
    try {
      const cache = (await AsyncStorage.getItem(CACHE_KEY)) || "{}";
      const parsedCache = JSON.parse(cache);
      parsedCache[name] = data;

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(parsedCache));
    } catch (error) {
      logError(error);
    }
  }
}