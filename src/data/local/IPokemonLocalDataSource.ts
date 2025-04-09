import { Pokemon } from 'src/domain/model/Pokemon'

export interface IPokemonLocalDataSource {
  getPokemons(): Promise<Record<string, Pokemon> | null>
  getPokemon(name: string): Promise<Pokemon | null>
  savePokemon(name: string, data: Pokemon): Promise<void>
}
