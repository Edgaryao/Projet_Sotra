import {
  ArrowUpRight,
  ChevronRight,
  LocateFixed,
  Search,
  Clock
} from "lucide-react-native";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function acceuil() {
  return (
    <ImageBackground
      source={require("../../../assets/images/background.png")}
      className="flex-1"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 px-5 pt-3">
        {/* Header with logo */}
        <View className="mb-8 flex-row items-center gap-3">
          <View>
            <Text className="text-xl font-extrabold text-gray-900 drop-shadow-lg">
              SOTRA GO
            </Text>
            <Text className="text-xs font-semibold tracking-wider text-gray-700">
              ABIDJAN
            </Text>
          </View>
        </View>

        {/* Main title section */}
        <View className="mb-6">
          <Text className="text-4xl font-extrabold leading-tight text-gray-900 drop-shadow-lg">
            Où souhaitez-vous aller ?
          </Text>
          <Text className="mt-3 text-base leading-6 text-gray-700">
            Trouvez une ligne ou un arrêt pour votre trajet.
          </Text>
        </View>

        {/* Search bar with shadow */}
        <View className="h-16 flex-row items-center gap-3 rounded-2xl bg-white px-5 shadow-2xl shadow-black/30">
          <Search color="#10B981" size={22} strokeWidth={2.5} />
          <TextInput
            accessibilityLabel="Rechercher une ligne de bus"
            className="flex-1 text-base font-medium text-gray-900"
            placeholder="Numero de bus, ligne, arrêt...."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Location button */}
        <Pressable
          accessibilityRole="button"
          className="mt-4 min-h-14 flex-row items-center gap-3 rounded-2xl bg-emerald-600 px-5 shadow-xl shadow-emerald-900/40"
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <LocateFixed color="white" size={22} strokeWidth={2.5} />
          <Text className="flex-1 text-sm font-bold text-white">
            Trouver les arrêts autour de moi
          </Text>
          <ChevronRight color="white" size={22} strokeWidth={2.5} />
        </Pressable>

        {/* Scrollable content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="mt-8 flex-1"
          contentContainerClassName="gap-6 pb-32"
        >
          {/* Quick access section */}
          <View>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-2xl font-extrabold text-gray-900">
                Accès rapide
              </Text>
            </View>
            <View className="flex-row justify-between gap-4">
              <Pressable
                accessibilityRole="button"
                className="min-h-44 flex-1 overflow-hidden rounded-3xl shadow-xl shadow-black/10"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                })}
              >
                <ImageBackground
                  source={require("../../../assets/images/trajet.jpg")}
                  className="flex-1 justify-between p-5"
                  resizeMode="cover"
                >
                  <View className="absolute inset-0 bg-black/40" />
                  <View className="flex-row items-center justify-between">
                    <View className="h-14 w-14 items-center justify-center rounded-2xl" />
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-white/90">
                      <ArrowUpRight
                        color="#6B7280"
                        size={18}
                        strokeWidth={2.5}
                      />
                    </View>
                  </View>
                  <View className="mt-6">
                    <Text className="text-xl font-extrabold text-white drop-shadow-lg">
                      Trouver un trajet
                    </Text>
                    <Text className="mt-1.5 text-xs leading-5 text-white/95 drop-shadow-md">
                      Départ ---{">"} Destination
                    </Text>
                  </View>
                </ImageBackground>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                className="min-h-44 flex-1 overflow-hidden rounded-3xl shadow-xl shadow-black/10"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                })}
              >
                <ImageBackground
                  source={require("../../../assets/images/carte.png")}
                  className="flex-1 justify-between p-5"
                  resizeMode="cover"
                >
                  <View className="absolute inset-0 bg-black/40" />
                  <View className="flex-row items-center justify-between">
                    <View className="h-14 w-14 items-center justify-center rounded-2xl"></View>
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-white/90">
                      <ArrowUpRight
                        color="#6B7280"
                        size={18}
                        strokeWidth={2.5}
                      />
                    </View>
                  </View>
                  <View className="mt-6">
                    <Text className="text-xl font-extrabold text-white drop-shadow-lg">
                      Carte des arrêts
                    </Text>
                    <Text className="mt-1.5 text-xs leading-5 text-white/95 drop-shadow-md">
                      Explorer les alentours
                    </Text>
                  </View>
                </ImageBackground>
              </Pressable>
            </View>
          </View>

          {/* Recent section */}
          <View>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-2xl font-extrabold text-gray-900">
                Récents
              </Text>
              <Pressable>
                <Text className="text-sm font-semibold text-emerald-700">
                  Tout effacer
                </Text>
              </Pressable>
            </View>

            {/* Recent items */}
            <View className="gap-3">
              <Pressable
                accessibilityRole="button"
                className="min-h-20 flex-row items-center gap-4 rounded-2xl bg-white p-4 shadow-lg shadow-black/5"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <Clock color="#047857" size={22} strokeWidth={2.2} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900">
                    Yopougon → Plateau
                  </Text>
                  <Text className="mt-1 text-xs text-gray-600">
                    Ligne 81 • Il y a 2 heures
                  </Text>
                </View>
                <ChevronRight color="#9CA3AF" size={20} strokeWidth={2.5} />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                className="min-h-20 flex-row items-center gap-4 rounded-2xl bg-white p-4 shadow-lg shadow-black/5"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
                  <Clock color="#0369A1" size={22} strokeWidth={2.2} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900">
                    Cocody → Adjamé
                  </Text>
                  <Text className="mt-1 text-xs text-gray-600">
                    Ligne 23 • Hier
                  </Text>
                </View>
                <ChevronRight color="#9CA3AF" size={20} strokeWidth={2.5} />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                className="min-h-20 flex-row items-center gap-4 rounded-2xl bg-white p-4 shadow-lg shadow-black/5"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <Clock color="#D97706" size={22} strokeWidth={2.2} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900">
                    Abobo → Marcory
                  </Text>
                  <Text className="mt-1 text-xs text-gray-600">
                    Ligne 57 • Il y a 3 jours
                  </Text>
                </View>
                <ChevronRight color="#9CA3AF" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
