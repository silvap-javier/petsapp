import { View, Text, StyleSheet, Button } from "react-native";
import { useAuth } from "../auth/AuthContext";

export function ProfileScreen() {
  const { signOut, session } = useAuth();

  return (
    <View style={styles.page}>
      <Text style={styles.heading}>Perfil</Text>
      {session?.user && (
        <View style={styles.card}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{session.user.name}</Text>
          <Text style={styles.label}>Correo</Text>
          <Text style={styles.value}>{session.user.email}</Text>
          <Text style={styles.label}>Rol</Text>
          <Text style={styles.value}>{session.user.role}</Text>
        </View>
      )}
      <Button title="Cerrar sesión" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 16,
    gap: 24
  },
  heading: {
    fontSize: 24,
    fontWeight: "600"
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb"
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    color: "#6b7280"
  },
  value: {
    fontSize: 16,
    fontWeight: "500"
  }
});
