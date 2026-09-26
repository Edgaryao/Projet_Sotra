import { Tabs } from "expo-router";
import { House, UserRound,BookOpenText, MessageCircleQuestion } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,

        tabBarStyle: {
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="acceuil"
        options={{
          title: "Acceuil",

          tabBarIcon: ({ color }) => <House size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cours"
        options={{
          title: "Cours",

          tabBarIcon: ({ color }) => <BookOpenText size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Ia"
        options={{
          title: "IA",
          tabBarIcon: ({ color }) => (
            <MessageCircleQuestion size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "profil",
          tabBarIcon: ({ color }) => <UserRound size={25} color={color} />,
        }}
      />
    </Tabs>
  );
}
