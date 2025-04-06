import { Container } from 'inversify';
import { IPokemonRepository } from 'src/data/repository/IPokemonRepository';
import { PokemonRepository } from 'src/data/repository/PokemonRepository';
import { PokemonUseCase } from 'src/domain/usecase/PokemonUseCase';
import { TYPES } from './type';

const container = new Container();

container.bind<IPokemonRepository>(TYPES.IPokemonRepository).to(PokemonRepository);
container.bind<PokemonUseCase>(PokemonUseCase).to(PokemonUseCase);

const getIPokenmonRepository = (): IPokemonRepository => {
  return container.get<IPokemonRepository>(TYPES.IPokemonRepository);
};

const getPokemonUseCase = (): PokemonUseCase => {
  return container.get<PokemonUseCase>(PokemonUseCase);
};

export { getIPokenmonRepository, getPokemonUseCase, container };
