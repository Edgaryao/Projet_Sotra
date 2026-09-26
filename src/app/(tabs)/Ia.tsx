import { ArrowUp, MessageCirclePlus } from "lucide-react-native";
import {
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Ia() {
  return (
    <SafeAreaView className="flex-1">
      <View className=" mt-4 p-4 border-b rounded-xl border-gray-300 ">
        <View className="mx-6 flex-row items-center justify-between">
          <Text className="text-lg font-bold">Coach IA</Text>
          <View className="flex-row items-center gap-2">
            <MessageCirclePlus />
            <Text className="text-lg font-bold">Nouveau chat</Text>
          </View>
        </View>
      </View>
      <View
        className="w-full flex-1 items-center justify-center"
      >
        <View className="w-full flex-1 items-center justify-between gap-4">
          <View className="w-full h-[90%] ">
            <View className="items-end mt-4 mr-4">
              <View className="bg-[#D9FDD3] dark:bg-light-btn p-3 rounded-xl max-w-[80%]">
                <Text className="font-inter-medium text-xl dark:text-white">
                  lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                </Text>
                <Text className="text-right text-gray-800 text-sm mt-1  dark:text-white">
                  02:30 PM
                </Text>
              </View>
            </View>
          </View>
          {/* input */}
        </View>
        <View className="w-full flex-row items-end gap-2 px-3  pt-2">
          <View className="min-h-14 flex-1 flex-row items-center rounded-3xl border border-gray-300 bg-gray-100 px-4 dark:border-dark-border dark:bg-dark-card">
            <TextInput
              numberOfLines={4}
              maxLength={300}
              returnKeyType="send"
              multiline
              placeholder="Écris ta question..."
              placeholderTextColor="#94a3b8"
              className="max-h-28 flex-1 py-3 text-base text-gray-900 dark:text-white"
            />
          </View>
          <Pressable className="h-14 w-14 items-center justify-center rounded-full bg-light-btn">
            <ArrowUp size={25} color="#fff" strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
