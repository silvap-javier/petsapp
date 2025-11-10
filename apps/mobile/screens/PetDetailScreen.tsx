import { View, Text, StyleSheet } from "react-native";
import { PetCard } from "@pets/ui";
import { usePet } from "@pets/sdk";

export function PetDetailScreen({ route }: { route: any }) {
  const { data: pet, isLoading } = usePet(route.params.id);

  if (isLoading) {
    return (
      <View style={styles.page}>
        <Text style={styles.muted}>Cargando mascota...</Text>
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.page}>
        <Text style={styles.muted}>Mascota no encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <PetCard pet={pet} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 16
  },
  muted: {
    textAlign: "center",
    color: "#6b7280"
  }
});
