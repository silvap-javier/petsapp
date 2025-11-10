import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button as PaperButton, Chip, FAB, Text as PaperText } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { PetCard } from "@pets/ui";
import { usePets } from "@pets/sdk";
import { useAuth } from "../auth/AuthContext";

const HERO_COLORS = ["#A0C4A8", "#F2B5A7"];

export function PetsScreen({ navigation }: { navigation: any }) {
  const { data: pets = [], isLoading, refetch, isRefetching } = usePets();
  const { session } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const firstName = useMemo(
    () => (session?.user.name ? session.user.name.split(" ")[0] : "Hola"),
    [session?.user.name]
  );

  const stats = useMemo(() => {
    const caretakers = pets.flatMap((pet) => pet.caretakers ?? []);
    const activeCaretakers = caretakers.filter((c) => c.status === "ACTIVE").length;

    const guardianIds = new Set(
      pets
        .flatMap((pet) => pet.guardians ?? [])
        .map((guardian) => guardian.user?.id)
        .filter(Boolean) as string[]
    );

    const organizationIds = new Set(
      pets
        .flatMap((pet) => pet.organizations ?? [])
        .map((link) => link.organization.id)
    );

    return {
      caretakers: activeCaretakers,
      guardians: guardianIds.size,
      organizations: organizationIds.size
    };
  }, [pets]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderHeader = useCallback(() => {
    const petCount = pets.length;
    const showStats = session?.user.role !== "GUARDIAN";
    return (
      <View style={styles.heroWrapper}>
        <LinearGradient colors={HERO_COLORS} style={styles.heroCard}>
          <PaperText variant="titleLarge" style={styles.heroTitle}>
            {firstName}, tus mascotas felices.
          </PaperText>
          <PaperText variant="bodyMedium" style={styles.heroSubtitle}>
            Llevas {petCount} {petCount === 1 ? "mascota" : "mascotas"} registradas.
          </PaperText>
          <View style={styles.heroButtons}>
            <PaperButton mode="contained-tonal" onPress={() => navigation.navigate("CreatePet")} icon="paw">
              Crear mascota
            </PaperButton>
            <PaperButton mode="outlined" onPress={() => navigation.navigate("Profile")} icon="account-heart">
              Mi perfil
            </PaperButton>
          </View>
        </LinearGradient>

        {showStats && (
          <View style={styles.chipRow}>
            <Chip mode="flat" icon="account-group">
              Guardianes: {stats.guardians}
            </Chip>
            <Chip mode="flat" icon="hand-heart">
              Cuidadores activos: {stats.caretakers}
            </Chip>
            <Chip mode="flat" icon="home-heart">
              Organizaciones: {stats.organizations}
            </Chip>
          </View>
        )}

        <PaperText variant="titleMedium" style={styles.sectionTitle}>
          Mis mascotas
        </PaperText>
      </View>
    );
  }, [firstName, navigation, pets.length, session?.user.role, stats.caretakers, stats.guardians, stats.organizations]);

  const renderPetCard = useCallback(
    ({ item }: { item: (typeof pets)[number] }) => (
      <PetCard pet={item} onPress={() => navigation.navigate("PetDetail", { id: item.id })} />
    ),
    [navigation, pets]
  );

  if (isLoading && !pets.length) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={pets}
        renderItem={renderPetCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <PaperText variant="bodyMedium" style={styles.emptyState}>
            Aún no agregaste mascotas. ¡Crea la primera para comenzar!
          </PaperText>
        }
        refreshControl={
          <RefreshControl
            tintColor={HERO_COLORS[0]}
            refreshing={refreshing || isRefetching}
            onRefresh={handleRefresh}
          />
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        label="Agregar"
        onPress={() => navigation.navigate("CreatePet")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  listContent: {
    padding: 20,
    paddingBottom: 120
  },
  heroWrapper: {
    gap: 16,
    marginBottom: 12
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    gap: 12
  },
  heroTitle: {
    color: "#1F2933",
    fontWeight: "700"
  },
  heroSubtitle: {
    color: "#1F2933"
  },
  heroButtons: {
    flexDirection: "row",
    gap: 12
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  sectionTitle: {
    marginTop: 4
  },
  loader: {
    flex: 1,
    justifyContent: "center"
  },
  emptyState: {
    textAlign: "center",
    marginTop: 32,
    color: "#6b7280"
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32
  }
});
