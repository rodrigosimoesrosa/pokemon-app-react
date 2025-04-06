import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Pokemon } from "src/domain/model/Pokemon";
import { getPokemonFormattedId } from "src/domain/usecase/PokemonConfig";
const { width, height } = Dimensions.get("window");

type PokemonCardProp = {
  pokemon: Pokemon;
};

const PokemonCard: React.FC<PokemonCardProp> = ({ pokemon }) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  if (pokemon.image) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Details", pokemon)}>
        <View style={styles.card}>
          <ImageBackground source={require("assets/images/placeholder.jpg")} style={styles.background}>
              <Image source={{uri: pokemon.image}} style={styles.pokemon} />
          </ImageBackground>
          <View style={styles.title}>
            <Text style={styles.name}>{getPokemonFormattedId(pokemon.id)}</Text>
            <Text style={styles.name}>{pokemon.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Details", pokemon)}>
      <View style={styles.card}>
        <Image source={require("assets/images/placeholder.jpg")} style={styles.background}/>
        <Text style={styles.name}>{getPokemonFormattedId(pokemon.id)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    alignItems: "center", 
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    margin: 4,
    padding: 8,
    borderRadius: 8,
    shadowColor: "#fff",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
    height: height * 0.15,
  },
  background: {
    width: width * 0.4,
    height: height * 0.1,
    resizeMode: "contain",
  },
  pokemon: {
    width: width * 0.4,
    height: height * 0.1,
    marginVertical: height * 0.005,
    marginHorizontal: width * -0.08,
    resizeMode: "contain",
  },
  image: {
    width: 150,
    height: 100,
    marginBottom: 8,
  },
  name: {
    fontSize: 15,
    padding: 2,
    fontWeight: "bold",
    color: "#FFD700",
    textShadowColor: "#003A70",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  }
});

export default PokemonCard;