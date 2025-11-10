// src/components/PetCard.jsx
import React from "react";
import { StyleSheet, Image, View } from "react-native";
import { Card, Text, Button, useTheme } from "react-native-paper";

export default function PetCard({ name, age, type, status, image, onPress }) {
  const { colors } = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        <Text variant="titleMedium" style={styles.name}>
          {name}
        </Text>
        <Text variant="bodySmall">
          {type} · {age} años · {status}
        </Text>
        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={onPress}
        >
          Ver perfil
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 160,
  },
  info: {
    padding: 12,
  },
  name: {
    fontWeight: "600",
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
});
