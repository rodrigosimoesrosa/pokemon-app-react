import { PokemonService } from "src/data/network/PokemonService";
import { logError } from "src/util/log";

jest.mock("src/util/log", () => ({
  logError: jest.fn(),
}));

describe("PokemonService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetchPokemons should return an array of pokemons", async () => {
    const mockPokemons = [
      { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ results: mockPokemons }),
    });

    const result = await PokemonService.fetchPokemons();

    expect(result).toEqual(mockPokemons);
    expect(global.fetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon?limit=151");
  });

  test("fetchPokemons should return an empty array on error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("API Error"));

    const result = await PokemonService.fetchPokemons();

    expect(result).toEqual([]);
    expect(logError).toHaveBeenCalledWith(new Error("API Error"));
  });

  test("fetchPokemonDetails should return pokemon details", async () => {
    const mockDetails = {
      name: "pikachu",
      sprites: { other: { "official-artwork": { front_default: "pikachu_image_url" } } },
      types: [{ type: { name: "electric" } }],
      height: 4,
      weight: 60,
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockDetails),
    });

    const result = await PokemonService.fetchPokemonDetails("pikachu");

    expect(result).toEqual({
      name: "pikachu",
      image: "pikachu_image_url",
      types: ["electric"],
      height: 4,
      weight: 60,
    });
    expect(global.fetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/pikachu");
  });

  test("fetchPokemonDetails should handle error and return null if fetch fails", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("API Error"));

    const result = await PokemonService.fetchPokemonDetails("pikachu");

    expect(result).toBeNull();
    expect(logError).toHaveBeenCalledWith(new Error("API Error"));
  });

  test("fetchPokemonDetails should return null if response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });

    const result = await PokemonService.fetchPokemonDetails("pikachu");

    expect(result).toBeNull();
    expect(logError).toHaveBeenCalledWith(new Error("Erro ao buscar detalhes do Pokémon"));
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
});
