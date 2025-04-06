import "reflect-metadata";
import { PokemonUseCase } from "src/domain/usecase/PokemonUseCase";
import { IPokemonRepository } from "src/data/repository/IPokemonRepository";
import { logError } from "src/util/log";
import { Pokemon } from "src/domain/model/Pokemon";

jest.mock("src/util/log", () => ({
  logError: jest.fn(),
}));

describe("PokemonUseCase", () => {
  let pokemonUseCase: PokemonUseCase;
  let mockRepository: jest.Mocked<IPokemonRepository>;

  beforeEach(() => {
    mockRepository = {
      getPokemons: jest.fn(),
      getPokemonDetails: jest.fn(),
    } as jest.Mocked<IPokemonRepository>;

    pokemonUseCase = new PokemonUseCase(mockRepository as jest.Mocked<IPokemonRepository>);
  });

  describe("fetch", () => {
    it("should return a list of pokemons successfully", async () => {
      const mockPokemons: Pokemon[] = [
        { name: "Pikachu", image: "pikachu.png" } as Pokemon,
        { name: "Charmander", image: "charmander.png" } as Pokemon,
      ];
      mockRepository.getPokemons.mockResolvedValue(mockPokemons);

      const result = await pokemonUseCase.fetch(151);

      expect(result).toEqual(mockPokemons);
      expect(mockRepository.getPokemons).toHaveBeenCalledWith(151);
    });

    it("should log an error and throw when repository fails", async () => {
      const error = new Error("Network error");
      mockRepository.getPokemons.mockRejectedValue(error);

      await expect(pokemonUseCase.fetch()).rejects.toThrow("Failed to fetch pokemons");
      expect(logError).toHaveBeenCalledWith(expect.stringContaining("Error in PokemonUseCase.fetch"));
    });
  });

  describe("details", () => {
    it("should return pokemon details successfully", async () => {
      const mockPokemon: Pokemon = {
        name: "Pikachu",
        image: "pikachu.png",
        height: 4,
        weight: 60,
        types: ["electric"],
      } as Pokemon;
      mockRepository.getPokemonDetails.mockResolvedValue(mockPokemon);

      const result = await pokemonUseCase.details("Pikachu");

      expect(result).toEqual(mockPokemon);
      expect(mockRepository.getPokemonDetails).toHaveBeenCalledWith("Pikachu");
    });

    it("should log an error and throw when repository fails", async () => {
      const error = new Error("Not Found");
      mockRepository.getPokemonDetails.mockRejectedValue(error);

      await expect(pokemonUseCase.details("Unknown")).rejects.toThrow("Failed to fetch details for Unknown");
      expect(logError).toHaveBeenCalledWith(expect.stringContaining("Error in PokemonUseCase.details"));
    });
  });
});
