import "reflect-metadata";
import { PokemonRepository } from "src/data/repository/PokemonRepository";
import { IPokemonRemoteDataSource } from "src/data/remote/IPokemonRemoteDataSource";
import { IPokemonLocalDataSource } from "src/data/local/IPokemonLocalDataSource";
import { Pokemon } from "src/domain/model/Pokemon";
import { logError } from "src/util/log";

jest.mock("src/util/log", () => ({
  logError: jest.fn(),
}));

const mockRemote: jest.Mocked<IPokemonRemoteDataSource> = {
  fetchPokemons: jest.fn(),
  fetchPokemonDetails: jest.fn(),
};

const mockLocal: jest.Mocked<IPokemonLocalDataSource> = {
  getPokemons: jest.fn(),
  getPokemon: jest.fn(),
  savePokemon: jest.fn(),
};

describe("PokemonRepository", () => {
  let repository: PokemonRepository;

  beforeEach(() => {
    repository = new PokemonRepository(mockRemote, mockLocal);
    jest.clearAllMocks();
  });

  describe("getPokemons", () => {
    it("deve retornar a lista de pokémons combinando cache local e remoto", async () => {
      const remote = [
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      ];
      const local = {
        bulbasaur: {
          name: "bulbasaur",
          image: "img.png",
          height: 7,
          weight: 69,
          types: ["grass", "poison"],
        },
      };

      mockRemote.fetchPokemons.mockResolvedValue(remote as any);
      mockLocal.getPokemons.mockResolvedValue(local);

      const result = await repository.getPokemons();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("bulbasaur");
      expect(result[0].image).toBe("img.png");
      expect(mockRemote.fetchPokemons).toHaveBeenCalled();
      expect(mockLocal.getPokemons).toHaveBeenCalled();
    });

    it("deve logar erro e lançar exceção em caso de falha", async () => {
      mockRemote.fetchPokemons.mockRejectedValue(new Error("Falha"));

      await expect(repository.getPokemons()).rejects.toThrow("Failed to fetch pokemons");
      expect(logError).toHaveBeenCalledWith(expect.stringContaining("Error in getPokemons"));
    });
  });

  describe("getPokemonDetails", () => {
    it("deve retornar o pokémon do cache local se existir", async () => {
      const localPokemon = { name: "pikachu", id: 25 } as Pokemon;
      mockLocal.getPokemon.mockResolvedValue(localPokemon);

      const result = await repository.getPokemonDetails("pikachu");

      expect(result).toEqual(localPokemon);
      expect(mockLocal.getPokemon).toHaveBeenCalledWith("pikachu");
      expect(mockRemote.fetchPokemonDetails).not.toHaveBeenCalled();
    });

    it("deve buscar remotamente e salvar no cache se não estiver em cache", async () => {
      const remotePokemon = { name: "charmander", id: 4 } as Pokemon;
      mockLocal.getPokemon.mockResolvedValue(null);
      mockRemote.fetchPokemonDetails.mockResolvedValue(remotePokemon);

      const result = await repository.getPokemonDetails("charmander");

      expect(result).toEqual(remotePokemon);
      expect(mockRemote.fetchPokemonDetails).toHaveBeenCalledWith("charmander");
      expect(mockLocal.savePokemon).toHaveBeenCalledWith("charmander", remotePokemon);
    });

    it("deve logar e lançar erro em caso de falha", async () => {
      mockLocal.getPokemon.mockRejectedValue(new Error("Erro local"));

      await expect(repository.getPokemonDetails("meowth")).rejects.toThrow("Erro local");
      expect(logError).toHaveBeenCalledWith(expect.stringContaining("Error fetching Pokémon details"));
    });
  });
});
