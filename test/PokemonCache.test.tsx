import AsyncStorage from "@react-native-async-storage/async-storage";
import { PokemonCache } from "../src/data/cache/PokemonCache";
import { logError } from "../src/util/log";

jest.mock("expo", () => ({
  registerRootComponent: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage");
jest.mock("src/util/log", () => ({
  logError: jest.fn(),
}));

describe("PokemonCache", () => {
  const mockPokemon = {
    name: "Pikachu",
    type: "Electric",
    url: "https://example.com/pikachu",
    image: "https://example.com/pikachu.png",
    types: ["Electric"],
    height: 4,
    weight: 60,
  };

  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockClear();
    (AsyncStorage.setItem as jest.Mock).mockClear();
  });

  test("getPokemons should return parsed data when cache exists", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ pikachu: mockPokemon }));
    const result = await PokemonCache.getPokemons();
    expect(result).toEqual({ pikachu: mockPokemon });
  });

  test("getPokemons should return null when cache is empty", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const result = await PokemonCache.getPokemons();
    expect(result).toBeNull();
  });

  test("getPokemon should return specific pokemon if found", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ pikachu: mockPokemon }));
    const result = await PokemonCache.getPokemon("pikachu");
    expect(result).toEqual(mockPokemon);
  });

  test("getPokemon should return null if pokemon is not found", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({}));
    const result = await PokemonCache.getPokemon("charizard");
    expect(result).toBeNull();
  });

  test("savePokemon should store pokemon in AsyncStorage", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    await PokemonCache.savePokemon("pikachu", mockPokemon);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "pokemon_cache",
      JSON.stringify({ pikachu: mockPokemon })
    );
  });

  test("savePokemon should merge with existing cache", async () => {
    const existingCache = { charizard: { name: "Charizard", type: "Fire" } };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingCache));
    await PokemonCache.savePokemon("pikachu", mockPokemon);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "pokemon_cache",
      JSON.stringify({ ...existingCache, pikachu: mockPokemon })
    );
  });

  test("should log error if AsyncStorage fails", async () => {
    const error = new Error("Storage error");
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(error);
    await PokemonCache.getPokemons();
    expect(logError).toHaveBeenCalledWith(error);
  });
  afterAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
});
