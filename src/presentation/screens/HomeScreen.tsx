import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import PokemonCard from "../components/PokemonCard";
import { PokemonsUseCase } from "src/domain/usecase/PokemonUseCase";
import { Pokemon } from "src/domain/model/Pokemon";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await PokemonsUseCase.fetch();
        setPokemons(data);
      };
      fetchData();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Pokedex',
      headerStyle: { backgroundColor: '#FF3D3D' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
    });
  }, [navigation]);

  const adjustedPokemons = useMemo(() => {
    const result = [...pokemons];
    if (pokemons.length % 2 !== 0) {
      result.push({ name: "empty-placeholder" } as Pokemon);
    }
    return result;
  }, [pokemons]);

  return (
    <SafeAreaView style={styles.container}>
       <LinearGradient colors={["#38B6FF", "#FF3D3D"]} style={styles.gradient}>
        <FlatList
          data={adjustedPokemons}
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
});

export default HomeScreen;
