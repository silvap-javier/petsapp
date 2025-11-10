import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { PetsScreen } from "./screens/PetsScreen";
import { PetDetailScreen } from "./screens/PetDetailScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { CreatePetScreen } from "./screens/CreatePetScreen";
import React from "react";
import { PaperProvider, IconButton } from "react-native-paper";
import { petsAppTheme } from "@pets/ui";

const AppStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const queryClient = new QueryClient();

function LogoutButton() {
  const { signOut } = useAuth();
  return (
    <IconButton
      icon="logout"
      size={22}
      onPress={signOut}
      containerColor="transparent"
      iconColor="#2563eb"
    />
  );
}

function RootNavigator() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
      </AuthStack.Navigator>
    );
  }
  return (
    <AppStack.Navigator initialRouteName="Pets">
      <AppStack.Screen
        name="Pets"
        component={PetsScreen}
        options={{ headerRight: () => <LogoutButton /> }}
      />
      <AppStack.Screen name="PetDetail" component={PetDetailScreen} />
      <AppStack.Screen name="Profile" component={ProfileScreen} />
      <AppStack.Screen name="CreatePet" component={CreatePetScreen} options={{ title: "Crear mascota" }} />
    </AppStack.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={petsAppTheme}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
            <StatusBar style="auto" />
          </SafeAreaProvider>
        </QueryClientProvider>
      </AuthProvider>
    </PaperProvider>
  );
}