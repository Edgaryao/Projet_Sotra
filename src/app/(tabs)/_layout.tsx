import { Tabs } from "expo-router";
import { Bell, House, Map, Plus, User,Bot , Send } from "lucide-react-native";
import { Pressable, Text , View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,

        tabBarStyle: {
          height: 70,
          position: "absolute",
          bottom: 15,
          left: 15,
          right: 15,
          borderRadius: 25,
          borderTopWidth: 0,
          elevation: 8,
        },
      }}
    >
      <Tabs.Screen
        name="exploration"
        options={{
          title: "Acceuil",

          tabBarIcon: ({ color }) => <House size={25} color={color} />,
        }}
      />

      <Tabs.Screen
        name="carte"
        options={{
          title: "Carte",

          tabBarIcon: ({ color }) => <Map size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "notification",

          tabBarIcon: ({ color }) => <Bell size={25} color={color} />,
        }}
      />

      <Tabs.Screen
        name="signaler"
        options={{
          tabBarButton: ({ onPress }) => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pressable
                onPress={onPress}
                style={{
                  position: "absolute",
                  top: -10,
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#E53935",
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 8,
                }}
              >
                <Plus size={28} color="white" />
              </Pressable>

            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="ChatBot"
        options={{
          title: "IA",
          tabBarIcon: ({ color }) => <Bot size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="signalements"
        options={{
          title: "signalements",
          tabBarIcon: ({ color }) => <Send size={25} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profil"
        options={{
          title: "profil",
          tabBarIcon: ({ color }) => <User size={25} color={color} />,
        }}
      />
    </Tabs>
  );
}
