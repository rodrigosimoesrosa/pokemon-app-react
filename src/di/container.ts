import { Container } from 'inversify';
import { IPokemonRepository } from 'src/data/repository/IPokemonRepository';
import { PokemonRepository } from 'src/data/repository/PokemonRepository';
import { PokemonUseCase } from 'src/domain/usecase/PokemonUseCase';
import { TYPES } from './type';
import { IPokemonRemoteDataSource } from 'src/data/remote/IPokemonRemoteDataSource';
import { PokemonRemoteDataSource } from 'src/data/remote/PokemonRemoteDataSource';
import { IPokemonLocalDataSource } from 'src/data/local/IPokemonLocalDataSource';
import { PokemonLocalDataSource } from 'src/data/local/PokemonLocalDataSource';

const container = new Container();

container.bind<IPokemonRemoteDataSource>(TYPES.IPokemonRemoteDataSource).to(PokemonRemoteDataSource);
container.bind<IPokemonLocalDataSource>(TYPES.IPokemonLocalDataSource).to(PokemonLocalDataSource);
container.bind<IPokemonRepository>(TYPES.IPokemonRepository).to(PokemonRepository);
container.bind<PokemonUseCase>(PokemonUseCase).to(PokemonUseCase);

const getIPokemonRemoteDataSource = (): IPokemonRemoteDataSource => container.get<IPokemonRemoteDataSource>(TYPES.IPokemonRemoteDataSource);
const getIPokemonLocalDataSource = (): IPokemonLocalDataSource => container.get<IPokemonLocalDataSource>(TYPES.IPokemonLocalDataSource);
const getIPokemonRepository = (): IPokemonRepository => container.get<IPokemonRepository>(TYPES.IPokemonRepository);

const getPokemonUseCase = (): PokemonUseCase => container.get<PokemonUseCase>(PokemonUseCase);

export { getIPokemonRepository, getIPokemonRemoteDataSource, getIPokemonLocalDataSource, getPokemonUseCase, container };
