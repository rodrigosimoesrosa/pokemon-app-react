import { Pokemon } from "src/domain/model/Pokemon";

export interface IPokemonRemoteDataSource {
    fetchPokemons(limit?: number): Promise<Pokemon[]>;
    fetchPokemonDetails(name: string): Promise<Pokemon | null>;
}