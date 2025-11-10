import { ReactNode } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Card, Text, Button, Chip, useTheme } from "react-native-paper";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=900&q=60";

type Pet = {
  id: string;
  name: string;
  species?: string | null;
  type?: string | null;
  breed?: string | null;
  color?: string | null;
  weightKg?: number | null;
  description?: string | null;
  imageUrl?: string | null;
  primaryOwner?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  guardians?: {
    id: string;
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    } | null;
  }[];
  organizations?: {
    id: string;
    status: string;
    organization: {
      id: string;
      name: string;
    };
  }[];
};

type Props = {
  pet?: Pet | null;
  onPress?: () => void;
  actions?: ReactNode;
};

export function PetCard({ pet, onPress, actions }: Props) {
  const { colors } = useTheme();

  if (!pet) {
    return (
      <Card mode="elevated" style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text style={styles.skeletonText}>Cargando mascota...</Text>
        </Card.Content>
      </Card>
    );
  }

  const coverSource = { uri: pet.imageUrl || FALLBACK_IMAGE };
  const paletteBadge = pet.type || pet.species || "Mascota";

  return (
    <Card mode="elevated" style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.media}>
        <ImageBackground source={coverSource} style={styles.cover} imageStyle={styles.coverImage}>
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <Text variant="labelSmall" style={styles.badgeText}>
              {paletteBadge}
            </Text>
          </View>
        </ImageBackground>
      </View>

      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text variant="titleMedium" style={styles.name}>
              {pet.name}
            </Text>
            <Text variant="bodySmall" style={styles.meta}>
              {[pet.breed, pet.color].filter(Boolean).join(" · ")}
            </Text>
            {typeof pet.weightKg === "number" && (
              <Text variant="bodySmall" style={styles.meta}>
                Peso: {pet.weightKg} kg
              </Text>
            )}
          </View>
          {actions}
        </View>

        {!!pet.description && (
          <Text variant="bodySmall" style={styles.description}>
            {pet.description}
          </Text>
        )}

        {!!pet.organizations?.length && (
          <View style={styles.chipRow}>
            {pet.organizations.map(({ id, organization, status }) => (
              <Chip key={id} mode="outlined" icon="office-building" style={styles.chip}>
                {organization.name} · {status.toLowerCase()}
              </Chip>
            ))}
          </View>
        )}

        {!!pet.guardians?.length && (
          <View style={styles.chipRow}>
            {pet.guardians
              .filter((g) => g.user)
              .map(({ id, role, user }) => (
                <Chip key={id} mode="flat" icon="account-heart" style={styles.helperChip}>
                  {user!.name} · {role.toLowerCase()}
                </Chip>
              ))}
          </View>
        )}

        {!!pet.primaryOwner && (
          <Text variant="bodySmall" style={styles.meta}>
            Dueño principal: {pet.primaryOwner.name} ({pet.primaryOwner.email})
          </Text>
        )}

        {onPress && (
          <Button mode="contained-tonal" style={styles.button} onPress={onPress}>
            Ver perfil
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 3
  },
  media: {
    height: 180,
    backgroundColor: "#00000010"
  },
  cover: {
    flex: 1,
    justifyContent: "flex-start"
  },
  coverImage: {
    resizeMode: "cover"
  },
  badge: {
    alignSelf: "flex-start",
    margin: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999
  },
  badgeText: {
    fontWeight: "600",
    color: "#3F3D56"
  },
  content: {
    gap: 12
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  titleGroup: {
    flex: 1,
    gap: 4
  },
  name: {
    fontWeight: "700"
  },
  meta: {
    color: "#4b5563"
  },
  description: {
    color: "#374151"
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    borderRadius: 999
  },
  helperChip: {
    borderRadius: 999,
    backgroundColor: "#F2B5A733"
  },
  button: {
    alignSelf: "flex-start",
    borderRadius: 999
  },
  skeletonText: {
    color: "#9ca3af"
  }
});
