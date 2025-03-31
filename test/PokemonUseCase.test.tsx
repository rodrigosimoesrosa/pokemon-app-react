import { PokemonRepository } from "src/data/repository/PokemonRepository";
import { PokemonsUseCase } from "src/domain/usecase/PokemonUseCase";

jest.mock("src/data/repository/PokemonRepository", () => ({
  PokemonRepository: {
    getPokemons: jest.fn(),
    getPokemonDetails: jest.fn(),
  },
}));

describe("PokemonsUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetch should call getPokemons from PokemonRepository and return data", async () => {
    const mockPokemons = [
      { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
    ];

    (PokemonRepository.getPokemons as jest.Mock).mockResolvedValue(mockPokemons);

    const result = await PokemonsUseCase.fetch();

    expect(result).toEqual(mockPokemons);
    expect(PokemonRepository.getPokemons).toHaveBeenCalled();
  });

  test("fetch should return empty array if getPokemons fails", async () => {
    (PokemonRepository.getPokemons as jest.Mock).mockResolvedValue([]);

    const result = await PokemonsUseCase.fetch();

    expect(result).toEqual([]);
    expect(PokemonRepository.getPokemons).toHaveBeenCalled();
  });

  test("details should call getPokemonDetails from PokemonRepository and return data", async () => {
    const mockPokemonDetails = {
      name: "pikachu",
      image: "pikachu_image_url",
      types: ["electric"],
      height: 4,
      weight: 60,
    };

    (PokemonRepository.getPokemonDetails as jest.Mock).mockResolvedValue(mockPokemonDetails);

    const result = await PokemonsUseCase.details("pikachu");

    expect(result).toEqual(mockPokemonDetails);
    expect(PokemonRepository.getPokemonDetails).toHaveBeenCalledWith("pikachu");
  });

  test("details should return null if getPokemonDetails fails", async () => {
    (PokemonRepository.getPokemonDetails as jest.Mock).mockResolvedValue(null);

    const result = await PokemonsUseCase.details("pikachu");

    expect(result).toBeNull();
    expect(PokemonRepository.getPokemonDetails).toHaveBeenCalledWith("pikachu");
  });
  afterAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
});
