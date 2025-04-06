import "reflect-metadata";
import { PokemonRepository } from "src/data/repository/PokemonRepository";
import { PokemonCache } from "src/data/cache/PokemonCache";
import { PokemonService } from "src/data/network/PokemonService";
import { Pokemon } from "src/domain/model/Pokemon";
import { IPokemonRepository } from "src/data/repository/IPokemonRepository";

jest.mock("src/data/cache/PokemonCache");
jest.mock("src/data/network/PokemonService");

describe("PokemonRepositoryImpl", () => {
  let repository: IPokemonRepository;
  const mockPokemon: Pokemon = {
    name: "pikachu",
    image: "pikachu.png",
    height: 4,
    weight: 60,
    types: ["electric"]
  } as Pokemon;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PokemonRepository();
  });

  describe("getPokemons", () => {
    it("should combine cache data with API data", async () => {
      const mockLocalPokemons = {
        pikachu: { ...mockPokemon, image: "cached-pikachu.png" }
      };
      const mockRemotePokemons = [{ ...mockPokemon }];

      (PokemonCache.getPokemons as jest.Mock).mockResolvedValue(mockLocalPokemons);
      (PokemonService.fetchPokemons as jest.Mock).mockResolvedValue(mockRemotePokemons);

      const result = await repository.getPokemons(151);

      expect(result[0].image).toBe("cached-pikachu.png");
      expect(PokemonCache.getPokemons).toHaveBeenCalled();
      expect(PokemonService.fetchPokemons).toHaveBeenCalledWith(151);
    });

    it("should return only API data if cache is empty", async () => {
      (PokemonCache.getPokemons as jest.Mock).mockResolvedValue({});
      (PokemonService.fetchPokemons as jest.Mock).mockResolvedValue([mockPokemon]);

      const result = await repository.getPokemons(50);
      expect(result[0]).toEqual(mockPokemon);
      expect(PokemonService.fetchPokemons).toHaveBeenCalledWith(50);
    });

    it("should handle API errors", async () => {
      (PokemonCache.getPokemons as jest.Mock).mockResolvedValue({});
      (PokemonService.fetchPokemons as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(repository.getPokemons()).rejects.toThrow("API Error");
    });
  });

  describe("getPokemonDetails", () => {
    it("should return Pokemon from cache if available", async () => {
      (PokemonCache.getPokemon as jest.Mock).mockResolvedValue(mockPokemon);

      const result = await repository.getPokemonDetails("pikachu");
      expect(result).toEqual(mockPokemon);
      expect(PokemonCache.getPokemon).toHaveBeenCalledWith("pikachu");
      expect(PokemonService.fetchPokemonDetails).not.toHaveBeenCalled();
    });

    it("should fetch from API and save in cache when not found in cache", async () => {
      (PokemonCache.getPokemon as jest.Mock).mockResolvedValue(null);
      (PokemonService.fetchPokemonDetails as jest.Mock).mockResolvedValue(mockPokemon);
      (PokemonCache.savePokemon as jest.Mock).mockResolvedValue(undefined);

      const result = await repository.getPokemonDetails("pikachu");

      expect(result).toEqual(mockPokemon);
      expect(PokemonService.fetchPokemonDetails).toHaveBeenCalledWith("pikachu");
      expect(PokemonCache.savePokemon).toHaveBeenCalledWith("pikachu", mockPokemon);
    });

    it("should handle API errors for details", async () => {
      (PokemonCache.getPokemon as jest.Mock).mockResolvedValue(null);
      (PokemonService.fetchPokemonDetails as jest.Mock).mockRejectedValue(new Error("Not Found"));

      await expect(repository.getPokemonDetails("unknown")).rejects.toThrow("Not Found");
    });

    it("should return null if the Pokemon does not exist", async () => {
      (PokemonCache.getPokemon as jest.Mock).mockResolvedValue(null);
      (PokemonService.fetchPokemonDetails as jest.Mock).mockResolvedValue(null);

      const result = await repository.getPokemonDetails("missingno");
      expect(result).toBeNull();
    });
  });
});
