import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  StatusBar
} from "react-native";
import PokemonCard from "src/presentation/components/PokemonCard";
import { Pokemon } from "src/domain/model/Pokemon";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import usePokemonStore from "src/store/pokemonStore";
import { generationRanges } from "src/domain/usecase/PokemonConfig";
import GenerationDropDown from "src/presentation/components/GenerationDropDown";
import TypeDropDown from "src/presentation/components/TypeDropDown";

const filterPokemons = (
  pokemons: Pokemon[],
  generation: number | null,
  type: string,
  search: string
) => {
  let filtered = [...pokemons];

  if (generation) {
    const [start, end] = generationRanges[generation];
    filtered = filtered.filter((p) => p.id >= start && p.id <= end);
  }

  if (type && type !== "all") {
    filtered = filtered.filter((p) =>
      p.types?.some((t) => t.toLowerCase() === type.toLowerCase())
    );
  }

  if (search.trim()) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }

  return filtered;
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { fetchPokemons, pokemons } = usePokemonStore((state) => state);

  const [generationFilter, setGenerationFilter] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState("");

  useEffect(
    useCallback(() => {
      fetchPokemons();
    }, [fetchPokemons])
  );

  useLayoutEffect(() => {
    navigation.setOptions(styles.headerStyle);
  }, [navigation]);

  const filteredPokemons = useMemo(
    () => filterPokemons(pokemons, generationFilter, typeFilter, searchText),
    [pokemons, generationFilter, typeFilter, searchText]
  );

  const memoPokemons = useMemo(() => {
    const values = [...filteredPokemons];
    if (filteredPokemons.length % 2 !== 0) {
      values.push({ name: "empty-placeholder" } as Pokemon);
    }
    return values;
  }, [filteredPokemons]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF3D3D" barStyle="light-content" />
      <LinearGradient colors={["#38B6FF", "#FF3D3D"]} style={styles.gradient}>
        <View style={styles.filterWrapper}>
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar por nome..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          <GenerationDropDown
            selected={generationFilter}
            onSelect={setGenerationFilter}
          />
          <TypeDropDown
            selected={typeFilter}
            onSelect={setTypeFilter}
          />
        </View>

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
  filterWrapper: {
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    elevation: 2,
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
    title: "Pokedex",
    headerStyle: { backgroundColor: "#FF3D3D" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
  } as Partial<object>,
});

export default HomeScreen;
