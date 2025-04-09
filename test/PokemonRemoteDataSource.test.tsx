import "reflect-metadata";
import { PokemonRemoteDataSource } from "src/data/remote/PokemonRemoteDataSource";
import { logError } from "src/util/log";
import { Pokemon } from "src/domain/model/Pokemon";

global.fetch = jest.fn();
jest.mock("src/util/log", () => ({
  logError: jest.fn(),
}));

describe("PokemonRemoteDataSource", () => {
  let dataSource: PokemonRemoteDataSource;

  beforeEach(() => {
    dataSource = new PokemonRemoteDataSource();
    jest.clearAllMocks();
  });

  describe("fetchPokemons", () => {
    it("deve retornar lista de pokémons do endpoint", async () => {
      const mockResults = [{ name: "bulbasaur", url: "url1" }];
      (fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({ results: mockResults }),
      });

      const result = await dataSource.fetchPokemons();

      expect(result).toEqual(mockResults);
      expect(fetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon?limit=151");
    });

    it("deve logar erro e retornar array vazio em caso de falha", async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error("fetch failed"));

      const result = await dataSource.fetchPokemons();

      expect(result).toEqual([]);
      expect(logError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("fetchPokemonDetails", () => {
    it("deve retornar detalhes do pokémon", async () => {
      const mockData = {
        name: "pikachu",
        height: 4,
        weight: 60,
        sprites: {
          other: {
            "official-artwork": {
              front_default: "https://img.png",
            },
          },
        },
        types: [{ type: { name: "electric" } }],
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await dataSource.fetchPokemonDetails("pikachu");

      expect(result).toEqual({
        name: "pikachu",
        height: 4,
        weight: 60,
        image: "https://img.png",
        types: ["electric"],
      });
    });

    it("deve retornar null e logar erro se response.ok for false", async () => {
      (fetch as jest.Mock).mockResolvedValue({ ok: false });

      const result = await dataSource.fetchPokemonDetails("mewtwo");

      expect(result).toBeNull();
      expect(logError).toHaveBeenCalled();
    });

    it("deve retornar null e logar erro em caso de exceção", async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error("network error"));

      const result = await dataSource.fetchPokemonDetails("mew");

      expect(result).toBeNull();
      expect(logError).toHaveBeenCalled();
    });
  });
});
