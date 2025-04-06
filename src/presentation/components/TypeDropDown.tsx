import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { pokemonTypes } from "src/domain/usecase/PokemonTypes";

interface Props {
  selected: string;
  onSelect: (value: string) => void;
}

const TypeDropDown: React.FC<Props> = ({ selected, onSelect }) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    selected === "all"
      ? "Todos os tipos"
      : pokemonTypes.find((t) => t.value === selected)?.label ?? "Tipo";

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>{selectedLabel}</Text>
        <Ionicons name="chevron-down" size={18} color="#333" />
      </TouchableOpacity>

      <Modal
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        backdropOpacity={0.4}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>Filtrar por tipo</Text>
          <FlatList
            data={[{ label: "Todos os tipos", value: "all" }, ...pokemonTypes]}
            keyExtractor={(item) => `${item.label}-${item.value}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onSelect(item.value);
                  setVisible(false);
                }}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  option: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#444",
  },
});

export default TypeDropDown;
