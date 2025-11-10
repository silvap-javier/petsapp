import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { createPet } from "@pets/sdk";
import { useAuth } from "../auth/AuthContext";

export function CreatePetScreen({ navigation }: { navigation: any }) {
  const { session } = useAuth();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await createPet({
        name: name.trim(),
        species: type.trim() || undefined,
        type: type.trim() || undefined,
        breed: breed.trim() || undefined,
        color: color.trim() || undefined,
        weightKg: weight ? Number(weight) : undefined,
        description: description.trim() || undefined,
        primaryOwnerId: session?.user.id
      });
      navigation.navigate("Pets");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la mascota.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nueva mascota</Text>
      <Text style={styles.subtitle}>Completa la información básica.</Text>

      <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Tipo (ej. Gato, Perro)" value={type} onChangeText={setType} />
      <TextInput style={styles.input} placeholder="Raza" value={breed} onChangeText={setBreed} />
      <TextInput style={styles.input} placeholder="Color" value={color} onChangeText={setColor} />
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        keyboardType="decimal-pad"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Descripción"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button title={submitting ? "Creando..." : "Crear mascota"} onPress={handleSubmit} disabled={submitting} />
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
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top"
  },
  error: {
    color: "#ef4444",
    textAlign: "center"
  }
});
