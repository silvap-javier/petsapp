import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { usePets } from "@pets/sdk";
import { PetCard } from "@pets/ui";

export function DashboardScreen({ navigation }: { navigation: any }) {
  const { session } = useAuth();
  const isGuardian = session?.user.role === "GUARDIAN";
  const { data: pets, isLoading } = usePets();

  if (!isGuardian) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Gestiona tus mascotas</Text>
        <Text style={styles.subtitle}>
          Todavía no tienes mascotas registradas. Crea un perfil para comenzar a organizarlas,
          añadir cuidadores o asociarlas a una colonia.
        </Text>
        <Button title="Crear mascota" onPress={() => navigation.navigate("CreatePet")} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.guardianContainer}>
      <Text style={styles.title}>Hola, {session.user.name.split(" ")[0]}</Text>
      <Text style={styles.subtitle}>
        Gestiona tus mascotas, agrega cuidadores y mantén la información al día.
      </Text>
      <View style={styles.actions}>
        <Button title="Ver todas" onPress={() => navigation.navigate("Pets")} />
        <Button title="Crear mascota" onPress={() => navigation.navigate("CreatePet")} />
      </View>
      <Text style={styles.sectionTitle}>Tus mascotas</Text>
      {isLoading ? (
        <Text style={styles.muted}>Cargando mascotas...</Text>
      ) : pets?.length ? (
        pets.slice(0, 3).map((pet) => (
          <PetCard key={pet.id} pet={pet} onPress={() => navigation.navigate("PetDetail", { id: pet.id })} />
        ))
      ) : (
        <Text style={styles.muted}>Aún no registraste mascotas. ¡Empieza creando una!</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 16
  },
  guardianContainer: {
    padding: 24,
    gap: 16
  },
  title: {
    fontSize: 26,
    fontWeight: "700"
  },
  subtitle: {
    color: "#4b5563"
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-start"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12
  },
  muted: {
    textAlign: "center",
    color: "#6b7280"
  }
});
