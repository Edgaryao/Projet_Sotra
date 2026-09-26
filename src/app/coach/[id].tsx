import { MessageCircleMore, SendHorizontal } from "lucide-react-native";
import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Return from "../components/Return";
export default function Ia() {
  const [breakLine, setBreakLine] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (text.trim().length) {
      console.log("Message envoyé :", text);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className=" mt-4 p-4 border-b rounded-xl border-gray-300 ">
        <View className="mx-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Return size={25} />
            <Text className="text-lg font-bold">Coach IA</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <MessageCircleMore />
            <Text className="text-lg font-bold">Nouveau chat</Text>
          </View>
        </View>
      </View>
      <View
        className="w-full flex-1 "
      >
        <ScrollView
          className="flex-1 w-full px-4  "
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
          {/* message utilisateur */}

          <View className="w-full flex-1 items-center gap-4">
            <View className="w-full items-center mt-6">
              <Text className="text-xl font-semibold">
                Qu'est ce vous préocupe Aujourd'hui ?
              </Text>
            </View>
            <View className="w-full flex-1 items-center justify-between gap-4">
              <View className="w-full h-[90%]">
                <View className="items-end mt-4 mr-4">
                  <View className="bg-[#D9FDD3] dark:bg-light-btn p-3 rounded-xl max-w-[80%]">
                    <Text className="font-inter-medium text-xl dark:text-white">
                      lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed
                    </Text>
                    <Text className="text-right text-gray-800 text-sm mt-1  dark:text-white">
                      02:30 PM
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* message IA  */}
            <View className="w-full flex-1 items-center justify-between gap-4">
              <View className="w-full h-[90%]">
                <View className="items-start mt-4 ml-4">
                  <View className="bg-[#d5d2d2] dark:bg-light-btn p-3 rounded-xl max-w-[80%]">
                    <Text className="font-inter-medium text-xl dark:text-white">
                      lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed
                    </Text>
                    <Text className="text-right text-gray-800 text-sm mt-1  dark:text-white">
                      02:30 PM
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* input chat */}
      <View className="w-full border-t border-gray-200 bg-white p-4 gap-4 flex-row items-center">
        <View
          className={
            breakLine
              ? "min-h-14 w-[85%] flex-row items-end rounded-2xl border border-gray-300 bg-gray-50 py-1 pl-3 pr-2"
              : "min-h-14 w-[85%]  flex-row items-center rounded-full border border-gray-300 bg-gray-50 py-1 pl-3 pr-2 dark:border-dark-border dark:bg-dark-card"
          }
        >
          <TextInput
            value={text}
            numberOfLines={4}
            autoFocus
            maxLength={300}
            returnKeyType="send"
            onSubmitEditing={() => {
              sendMessage();
              setNewMessage(true);
            }}
            multiline={true}
            onChangeText={(value) => {
              setText(value);
              setBreakLine(value.length > 53);
            }}
            placeholder="Écrire un message..."
            placeholderTextColor="#9CA3AF"
            className="max-h-28 min-h-12 flex-1 px-3 py-2 text-base dark:text-white"
          />
        </View>
        <Pressable
          className="h-14 w-14 items-center justify-center rounded-full bg-light-btn"
          style={{
            opacity: text.trim().length ? 1 : 0.45,
          }}
          disabled={!text.trim().length}
          onPress={sendMessage}
        >
          <SendHorizontal size={35} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
