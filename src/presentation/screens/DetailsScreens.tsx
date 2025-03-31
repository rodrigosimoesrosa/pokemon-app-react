import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, ActivityIndicator, ImageBackground } from "react-native";
import { PokemonsUseCase } from "src/domain/usecase/PokemonUseCase";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");


const DetailsScreen = ({ route }: any) => {
  const navigation = useNavigation();

  const { name } = route.params;
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await PokemonsUseCase.details(name);
      setPokemon(data);
      setLoading(false);
    };
    fetchDetails();
  }, [name]);

  useLayoutEffect(() => {
      navigation.setOptions({
        title: 'Pokemon Details',
        headerStyle: { backgroundColor: '#FF3D3D' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
      });
    }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  if (pokemon) {
    return <View style={styles.container}>
        <ImageBackground source={require("assets/images/placeholder.jpg")} style={styles.background}>
          <Image source={{uri: pokemon.image}} style={styles.pokemon} />
        </ImageBackground>
        <View style={styles.content}>
        <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
        <Text style={styles.info}>Tipos: {pokemon.types.join(", ")}</Text>
        <Text style={styles.info}>Altura: {pokemon.height / 10} m</Text>
        <Text style={styles.info}>Peso: {pokemon.weight / 10} kg</Text>
      </View>
    </View>
  }

  return (
    <View style={styles.container}> 
      <Image source={require("assets/images/placeholder.jpg")} style={styles.background} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#38B6FF", // 🔥 Azul vibrante no fundo
  },
  background: {
    width: width,
    height: height * 0.4,
    resizeMode: "cover",
  },
  pokemon: {
    width: width,
    marginVertical: height * 0.05,
    marginHorizontal: width * -0.2,
    height: height * 0.3,
    resizeMode: "contain",
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700", // 🔥 Amarelo Pokémon
    textShadowColor: "#003A70", // 🔥 Azul escuro Pokémon
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    fontSize: 18,
    marginTop: 10,
    color: "#fff", // 🔥 Texto branco para destacar
    textShadowColor: "#003A70", // 🔥 Sombra azul escuro
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default DetailsScreen;
