import { router, useLocalSearchParams } from "expo-router";
import { ChevronRightCircle } from "lucide-react-native";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Return from "../components/Return";
export default function choix() {
  const { id } = useLocalSearchParams();
  return (
    <SafeAreaView className="flex-1">
      {/* titre et flèche */}
      <View className="w-full flex-row items-center gap-6 justify-between mt-2">
        <Return size={34} />
        <Text className="text-3xl font-semibold text-black">{id} </Text>
        <View></View>
      </View>
      {/* choix */}
      <View className="items-center mt-6">
        <Text className="text-xl font-semibold text-gray-600">
          Que voulez-vous faire ?
        </Text>
      </View>
     
      
    </SafeAreaView>
  );
}
