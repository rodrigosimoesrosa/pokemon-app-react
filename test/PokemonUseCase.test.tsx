import "reflect-metadata";
import { PokemonUseCase } from "../src/domain/usecase/PokemonUseCase";
import type { IPokemonRepository } from "../src/data/repository/IPokemonRepository";
import { logError } from "../src/util/log";
import { Pokemon } from "../src/domain/model/Pokemon";

jest.mock("src/util/log", () => ({
  logError: jest.fn(),
}));

describe("PokemonUseCase", () => {
  let mockRepo: jest.Mocked<IPokemonRepository>;
  let useCase: PokemonUseCase;

  beforeEach(() => {
    mockRepo = {
      getPokemons: jest.fn(),
      getPokemonDetails: jest.fn(),
    };

    useCase = new PokemonUseCase(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetch", () => {
    it("deve retornar pokémons do repositório", async () => {
      const pokemons: Pokemon[] = [{ name: "pikachu", id: 1 } as Pokemon];
      mockRepo.getPokemons.mockResolvedValue(pokemons);

      const result = await useCase.fetch();

      expect(result).toEqual(pokemons);
      expect(mockRepo.getPokemons).toHaveBeenCalledTimes(1);
    });

    it("deve logar e lançar erro se o repositório falhar", async () => {
      mockRepo.getPokemons.mockRejectedValue(new Error("Repo error"));

      await expect(useCase.fetch()).rejects.toThrow("Failed to fetch pokemons");
      expect(logError).toHaveBeenCalledWith(expect.stringContaining("Error in PokemonUseCase.fetch"));
    });
  });

  describe("details", () => {
    it("deve retornar detalhes de um pokémon", async () => {
      const details = { name: "pikachu", id: 1 } as Pokemon;
      mockRepo.getPokemonDetails.mockResolvedValue(details);

      const result = await useCase.details("pikachu");

      expect(result).toEqual(details);
      expect(mockRepo.getPokemonDetails).toHaveBeenCalledWith("pikachu");
    });

    it("deve logar e lançar erro se o repositório falhar", async () => {
      mockRepo.getPokemonDetails.mockRejectedValue(new Error("Detail error"));

      await expect(useCase.details("pikachu")).rejects.toThrow("Failed to fetch details for pikachu");
      expect(logError).toHaveBeenCalledWith(expect.stringContaining("Error in PokemonUseCase.details"));
    });
  });
});
