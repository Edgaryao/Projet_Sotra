import { Layers, MapPin, Navigation, Search } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SotraMap from "../components/Carte";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Carte en plein écran */}
      <View className="absolute inset-0">
        <SotraMap />
      </View>

      {/* Overlay UI */}
      <SafeAreaView className="flex-1">
        {/* Barre de recherche en haut */}
        <View className="mx-4 mt-3">
          <View className="h-14 flex-row items-center gap-3 rounded-xl bg-white px-4 shadow-2xl shadow-black/30">
            <Search color="#10B981" size={22} strokeWidth={2.5} />
            <TextInput
              className="flex-1 text-base font-medium text-gray-900"
              placeholder="Rechercher un lieu..."
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Boutons flottants à droite */}
        <View className="absolute right-4 top-24 gap-3">
          {/* Bouton localisation */}
          <Pressable
            className="h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg shadow-black/20"
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Navigation color="#059669" size={22} strokeWidth={2.5} />
          </Pressable>

          {/* Bouton layers */}
          <Pressable
            className="h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg shadow-black/20"
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Layers color="#6B7280" size={22} strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* Bouton d'action principal en bas */}
        <View className="absolute bottom-6 left-4 right-4">
          <Pressable
            className="h-14 flex-row items-center justify-center gap-3 rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-900/40"
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <MapPin color="white" size={22} strokeWidth={2.5} />
            <TextInput
              className="flex-1 text-base font-bold text-white"
              placeholder="Entrer une destination..."
              placeholderTextColor="rgba(255, 255, 255, 0.8)"
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
