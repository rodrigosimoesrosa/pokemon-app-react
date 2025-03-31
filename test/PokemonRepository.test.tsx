import { PokemonCache } from "src/data/cache/PokemonCache";
import { PokemonService } from "src/data/network/PokemonService";
import { PokemonRepository } from "src/data/repository/PokemonRepository";

jest.mock("src/data/cache/PokemonCache");
jest.mock("src/data/network/PokemonService");

describe("PokemonRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getPokemons should return remote pokemons if cache is empty", async () => {
    const remotePokemons = [
      { name: "bulbasaur", image: "url1", height: 7, weight: 69, types: ["grass", "poison"] },
      { name: "charmander", image: "url2", height: 6, weight: 85, types: ["fire"] },
    ];

    (PokemonCache.getPokemons as jest.Mock).mockResolvedValue(null);
    (PokemonService.fetchPokemons as jest.Mock).mockResolvedValue(remotePokemons);

    const result = await PokemonRepository.getPokemons();
    expect(result).toEqual(remotePokemons);
    expect(PokemonCache.getPokemons).toHaveBeenCalled();
    expect(PokemonService.fetchPokemons).toHaveBeenCalledWith(151);
  });

  test("getPokemons should merge cache data with remote data", async () => {
    const cachedPokemons = {
      bulbasaur: { image: "cached_url1", height: 10, weight: 70, types: ["grass"] },
    };
    const remotePokemons = [
      { name: "bulbasaur", image: "", height: 0, weight: 0, types: [] },
      { name: "charmander", image: "url2", height: 6, weight: 85, types: ["fire"] },
    ];

    (PokemonCache.getPokemons as jest.Mock).mockResolvedValue(cachedPokemons);
    (PokemonService.fetchPokemons as jest.Mock).mockResolvedValue(remotePokemons);

    const result = await PokemonRepository.getPokemons();
    expect(result[0].image).toBe("cached_url1");
    expect(result[0].height).toBe(10);
    expect(result[0].weight).toBe(70);
    expect(result[0].types).toEqual(["grass"]);
  });

  test("getPokemonDetails should return cached pokemon if available", async () => {
    const cachedPokemon = { name: "pikachu", image: "cached_url", height: 4, weight: 60, types: ["electric"] };
    (PokemonCache.getPokemon as jest.Mock).mockResolvedValue(cachedPokemon);

    const result = await PokemonRepository.getPokemonDetails("pikachu");
    expect(result).toEqual(cachedPokemon);
    expect(PokemonCache.getPokemon).toHaveBeenCalledWith("pikachu");
    expect(PokemonService.fetchPokemonDetails).not.toHaveBeenCalled();
  });

  test("getPokemonDetails should fetch and cache pokemon if not found locally", async () => {
    const remotePokemon = { name: "pikachu", image: "remote_url", height: 4, weight: 60, types: ["electric"] };
    (PokemonCache.getPokemon as jest.Mock).mockResolvedValue(null);
    (PokemonService.fetchPokemonDetails as jest.Mock).mockResolvedValue(remotePokemon);

    const result = await PokemonRepository.getPokemonDetails("pikachu");
    expect(result).toEqual(remotePokemon);
    expect(PokemonCache.getPokemon).toHaveBeenCalledWith("pikachu");
    expect(PokemonService.fetchPokemonDetails).toHaveBeenCalledWith("pikachu");
    expect(PokemonCache.savePokemon).toHaveBeenCalledWith("pikachu", remotePokemon);
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
});
