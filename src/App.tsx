import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>...</SafeAreaProvider>
  );
}

/*<View style={styles.container}>
    <Text>Rodrigo!</Text>
    <StatusBar style="auto" />
  </View>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
