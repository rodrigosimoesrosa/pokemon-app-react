import "reflect-metadata";
import AppNavigator from "src/presentation/navigation/AppNavigator";
import { Provider } from "inversify-react";
import { container } from "src/di/container";

export default function App() {
  return <Provider container={() => container}><AppNavigator /></Provider>
}