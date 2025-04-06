import React, { useCallback, useLayoutEffect, useMemo } from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import PokemonCard from "src/presentation/components/PokemonCard";
import { Pokemon } from "src/domain/model/Pokemon";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import usePokemonStore from "src/store/pokemonStore";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { fetchPokemons, pokemons } = usePokemonStore((state) => state);

  useFocusEffect(useCallback(() => { fetchPokemons() }, [fetchPokemons]));

  useLayoutEffect(() => {
    navigation.setOptions(styles.headerStyle);
  }, [navigation]);

  const memoPokemons = useMemo(() => {
    const values = [...pokemons];
    if (pokemons.length % 2 !== 0) {
      values.push({ name: "empty-placeholder" } as Pokemon);
    }
    return values;
  }, [pokemons]);

  return (
    <SafeAreaView style={styles.container}>
       <LinearGradient colors={["#38B6FF", "#FF3D3D"]} style={styles.gradient}>
        <FlatList
          data={memoPokemons}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) =>
            item.name === "empty-placeholder" ? (
              <View style={[styles.card, styles.hidden]} />
            ) : (
              <PokemonCard pokemon={item} />
            )
          }
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  gradient: {
    flex: 1,
    padding: 10,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    margin: 10,
    height: 150,
  },
  hidden: {
    backgroundColor: "transparent",
  },
  headerStyle: {
    title: 'Pokedex',
    headerStyle: { backgroundColor: '#FF3D3D' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
  } as Partial<object>,
});

export default HomeScreen;
