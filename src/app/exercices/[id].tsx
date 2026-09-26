import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function choix() {
  const { id } = useLocalSearchParams();
  const lecon = [
    { id: 1, titre: "Limites et continuités", pourcentage: 30 },
    { id: 2, titre: "Dérivées", pourcentage: 0 },
    { id: 3, titre: "Fonctions", pourcentage: 0 },
  ];

  return (
    <View className="flex-1">
      <View className="h-[28%] justify-center bg-green-800">
        <View className="mt-6 w-full flex-row items-center justify-between px-4">
          <Pressable className="rounded-full p-4" onPress={() => router.back()}>
            <ArrowLeft size={34} color="#fff" />
          </Pressable>
          <View className="items-end">
            <Text className="text-3xl font-semibold text-white">{id}</Text>
            <Text className="text-xl text-slate-200">12 leçons</Text>
          </View>
          <View className="w-14" />
        </View>
      </View>

      <View className="-mt-8 flex-1 rounded-t-[20px] bg-white px-4 pt-6">
        <Text className="mb-4 text-xl font-bold text-gray-900">Tes leçons</Text>
        {lecon.map((item) => (
          <View
            key={item.id}
            className="mb-3 flex-row items-center justify-between rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
          >
            <View className="flex-1 flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-green-900">
                <Text className="text-xl font-semibold text-white">
                  {item.id}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">
                  {item.titre}
                </Text>
                <View className="mt-2 h-2 overflow-hidden rounded-full bg-green-100">
                  <View
                    className="h-full rounded-full bg-green-900"
                    style={{ width: `${item.pourcentage}%` }}
                  />
                </View>
                <Text className="mt-1 text-sm font-semibold text-gray-500">
                  {item.pourcentage} % terminé
                </Text>
              </View>
            </View>
            <ChevronRight size={28} color="#1e3a8a" />
          </View>
        ))}
      </View>
    </View>
  );
}
