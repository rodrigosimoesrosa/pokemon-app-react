import "reflect-metadata";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PokemonLocalDataSource } from "src/data/local/PokemonLocalDataSource";
import { logError } from "src/util/log";
import { Pokemon } from "src/domain/model/Pokemon";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock("src/util/log", () => ({
  logError: jest.fn(),
}));

describe("PokemonLocalDataSource", () => {
  let localDataSource: PokemonLocalDataSource;

  beforeEach(() => {
    localDataSource = new PokemonLocalDataSource();
    jest.clearAllMocks();
  });

  describe("getPokemons", () => {
    it("deve retornar pokémons do cache", async () => {
      const cached = JSON.stringify({ pikachu: { name: "pikachu" } });
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(cached);

      const result = await localDataSource.getPokemons();

      expect(result).toEqual({ pikachu: { name: "pikachu" } });
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("POKEMON_CACHE");
    });

    it("deve retornar null se não houver cache", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await localDataSource.getPokemons();

      expect(result).toBeNull();
    });

    it("deve logar erro e retornar null em caso de exceção", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error("Erro"));

      const result = await localDataSource.getPokemons();

      expect(result).toBeNull();
      expect(logError).toHaveBeenCalled();
    });
  });

  describe("getPokemon", () => {
    it("deve retornar um pokémon específico do cache", async () => {
      const cached = JSON.stringify({ pikachu: { name: "pikachu" } });
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(cached);

      const result = await localDataSource.getPokemon("pikachu");

      expect(result).toEqual({ name: "pikachu" });
    });

    it("deve retornar null se pokémon não estiver no cache", async () => {
      const cached = JSON.stringify({});
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(cached);

      const result = await localDataSource.getPokemon("charmander");

      expect(result).toBeNull();
    });

    it("deve logar erro e retornar null em caso de exceção", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error("Erro"));

      const result = await localDataSource.getPokemon("pikachu");

      expect(result).toBeNull();
      expect(logError).toHaveBeenCalled();
    });
  });

  describe("savePokemon", () => {
    it("deve salvar ou atualizar um pokémon no cache", async () => {
      const previousCache = JSON.stringify({});
      const data = { name: "pikachu" } as Pokemon;

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(previousCache);

      await localDataSource.savePokemon("pikachu", data);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "POKEMON_CACHE",
        JSON.stringify({ pikachu: data })
      );
    });

    it("deve logar erro se falhar ao salvar", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error("Erro"));

      await localDataSource.savePokemon("pikachu", { name: "pikachu" } as Pokemon);

      expect(logError).toHaveBeenCalled();
    });
  });
});
