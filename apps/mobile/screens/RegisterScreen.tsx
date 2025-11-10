import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Image,
  ScrollView
} from "react-native";
import { useAuth } from "../auth/AuthContext";
import { registerUser, UserRole } from "@pets/sdk";

const ROLE_OPTIONS: Array<{
  value: UserRole;
  title: string;
  description: string;
  image: string;
}> = [
  {
    value: "GUARDIAN",
    title: "Dueño de mascota",
    description: "Registra a tus mascotas, gestiona cuidados y comparte perfil.",
    image: "https://images.unsplash.com/photo-1557970870-719c1c51ab2b?auto=format&fit=crop&w=300&q=60"
  },
  {
    value: "SITTER",
    title: "Cuidador / Sitter",
    description: "Ofrece servicios de cuidado y gestiona mascotas asignadas.",
    image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=300&q=60"
  },
  {
    value: "ORGANIZATION_OWNER",
    title: "Asociación / Colonia",
    description: "Administra miembros, colonias y mascotas rescatadas.",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=60"
  }
];

export function RegisterScreen({ navigation }: { navigation: any }) {
  const { signIn } = useAuth();
  const [role, setRole] = useState<UserRole>("GUARDIAN");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError("Completa todos los campos.");
      return;
    }

    setSubmitting(true);
    try {
      await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role
      });
      await signIn(email.trim().toLowerCase(), password);
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes("409")
          ? "El email ya está registrado."
          : err instanceof Error
          ? err.message
          : "No se pudo crear la cuenta.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crea tu cuenta</Text>
      <Text style={styles.subtitle}>Selecciona el rol que mejor te describa.</Text>

      <View style={styles.roles}>
        {ROLE_OPTIONS.map((option) => {
          const selected = role === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setRole(option.value)}
              style={[styles.roleCard, selected && styles.roleCardSelected]}
            >
              <Image source={{ uri: option.image }} style={styles.roleImage} />
              <Text style={styles.roleTitle}>{option.title}</Text>
              <Text style={styles.roleDescription}>{option.description}</Text>
            </Pressable>
          );
        })}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title={submitting ? "Creando cuenta..." : "Registrarme"}
        onPress={handleSubmit}
        disabled={submitting}
      />

      <Pressable style={styles.link} onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center"
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280"
  },
  roles: {
    flexDirection: "column",
    gap: 12
  },
  roleCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    backgroundColor: "#fff"
  },
  roleCardSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff"
  },
  roleImage: {
    width: "100%",
    height: 120,
    borderRadius: 8
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "600"
  },
  roleDescription: {
    fontSize: 13,
    color: "#4b5563"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  error: {
    color: "#ef4444",
    textAlign: "center"
  },
  link: {
    marginTop: 8
  },
  linkText: {
    textAlign: "center",
    color: "#2563eb",
    fontWeight: "500"
  }
});
