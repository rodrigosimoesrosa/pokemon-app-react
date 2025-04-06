import "reflect-metadata";
import { PokemonRepository } from "../src/data/repository/PokemonRepository";
import { PokemonCache } from "../src/data/cache/PokemonCache";
import { PokemonService } from "../src/data/network/PokemonService";
import { getPokemonGeneration, getPokemonId } from "../src/domain/usecase/PokemonConfig";
import { logError } from "../src/util/log";

jest.mock("src/data/cache/PokemonCache");
jest.mock("src/data/network/PokemonService");
jest.mock("src/domain/usecase/PokemonConfig", () => ({
  getPokemonId: jest.fn(),
  getPokemonGeneration: jest.fn(),
  TOTAL: 3, // mocka TOTAL com um número baixo para teste
}));
jest.mock("src/util/log");

describe("PokemonRepository", () => {
  const repository = new PokemonRepository();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPokemons", () => {
    it("deve retornar os pokemons combinando cache com dados da API", async () => {
      const remote = [
        { name: "pikachu", url: "url1" },
        { name: "bulbasaur", url: "url2" },
      ];

      const cache = {
        pikachu: {
          image: "img1",
          height: 10,
          weight: 20,
          types: ["electric"],
        },
      };

      (PokemonCache.getPokemons as jest.Mock).mockResolvedValue(cache);
      (PokemonService.fetchPokemons as jest.Mock).mockResolvedValue(remote);
      (getPokemonId as jest.Mock).mockImplementation((url: string) =>
        url === "url1" ? 1 : 2
      );
      (getPokemonGeneration as jest.Mock).mockImplementation((id: number) =>
        id === 1 ? 1 : 1
      );

      const result = await repository.getPokemons();

      expect(result).toHaveLength(2);

      expect(result[0]).toMatchObject({
        name: "pikachu",
        image: "img1",
        height: 10,
        weight: 20,
        types: ["electric"],
        id: 1,
        generation: 1,
      });

      expect(result[1]).toMatchObject({
        name: "bulbasaur",
        id: 2,
        generation: 1,
      });
    });

    it("deve lançar erro e logar quando falhar", async () => {
      (PokemonService.fetchPokemons as jest.Mock).mockRejectedValue(
        new Error("API Error")
      );

      await expect(repository.getPokemons()).rejects.toThrow(
        "Failed to fetch pokemons"
      );

      expect(logError).toHaveBeenCalledWith(
        expect.stringContaining("Error in getPokemons")
      );
    });
  });

  describe("getPokemonDetails", () => {
    it("deve retornar detalhes do cache se disponíveis", async () => {
      const cached = { name: "pikachu", id: 1 };
      (PokemonCache.getPokemon as jest.Mock).mockResolvedValue(cached);

      const result = await repository.getPokemonDetails("pikachu");

      expect(result).toEqual(cached);
      expect(PokemonService.fetchPokemonDetails).not.toHaveBeenCalled();
    });

    it("deve buscar detalhes da API e salvar no cache se não houver no cache", async () => {
      const remote = { name: "pikachu", id: 1 };

      (PokemonCache.getPokemon as jest.Mock).mockResolvedValue(null);
      (PokemonService.fetchPokemonDetails as jest.Mock).mockResolvedValue(remote);

      const saveMock = PokemonCache.savePokemon as jest.Mock;
      saveMock.mockResolvedValue(undefined);

      const result = await repository.getPokemonDetails("pikachu");

      expect(result).toEqual(remote);
      expect(saveMock).toHaveBeenCalledWith("pikachu", remote);
    });

    it("deve lançar erro e logar se a API falhar", async () => {
      (PokemonCache.getPokemon as jest.Mock).mockResolvedValue(null);
      (PokemonService.fetchPokemonDetails as jest.Mock).mockRejectedValue(
        new Error("Detail Error")
      );

      await expect(repository.getPokemonDetails("pikachu")).rejects.toThrow(
        "Detail Error"
      );
      expect(logError).toHaveBeenCalledWith(
        expect.stringContaining("Error fetching Pokémon details")
      );
    });
  });
});
