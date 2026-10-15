import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="acceuil" />
      <Stack.Screen name="carte" />
      <Stack.Screen name="Ia" />
      <Stack.Screen name="profil" />
      <Stack.Screen name="parametre" />
    </Stack>
  );
}
