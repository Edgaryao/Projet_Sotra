import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowUp, BusFront, MessageCirclePlus, Sparkles } from "lucide-react-native";
import Return from "../components/Return";

export default function Ia() {
  const [inputText, setInputText] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [messages, setMessages] = useState<{ id: number; text: string; from: "user" | "assistant" }[]>([]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSubscription = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const envoyerMessage = () => {
    const texte = inputText.trim();
    if (!texte) return;
    setMessages((actuels) => [...actuels, { id: Date.now(), text: texte, from: "user" }]);
    setInputText("");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-dark-bg" edges={["top", "right", "left"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <View className="flex-row items-center justify-between border-b border-slate-200 bg-white px-5 py-3 dark:border-dark-border dark:bg-dark-card">
          <View className="flex-row items-center gap-2">
            <Return size={22} />
            <Text className="text-base font-semibold text-slate-800 dark:text-white">Retour</Text>
          </View>
          <Text className="text-lg font-bold text-slate-900 dark:text-white">Assistant</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Nouveau chat"
            onPress={() => setMessages([])}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-slate-700"
          >
            <MessageCirclePlus size={22} color="#0f766e" />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 18, paddingVertical: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <View className="flex-1 items-center justify-center px-5 pb-8">
              <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-900/30">
                <BusFront size={30} color="#0f766e" />
              </View>
              <View className="mb-2 flex-row items-center gap-2">
                <Sparkles size={17} color="#0f766e" />
                <Text className="text-xl font-bold text-slate-900 dark:text-white">Comment puis-je vous aider ?</Text>
              </View>
              <Text className="text-center text-sm leading-6 text-slate-500 dark:text-slate-300">
                Posez une question sur les bus, les lignes ou les arrêts de votre réseau.
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {messages.map((message) => (
                <View key={message.id} className={message.from === "user" ? "items-end" : "items-start"}>
                  <View className={message.from === "user" ? "max-w-[85%] rounded-2xl rounded-br-md bg-teal-700 px-4 py-3" : "max-w-[90%] rounded-2xl rounded-bl-md bg-white px-4 py-3 dark:bg-dark-card"}>
                    <Text className={message.from === "user" ? "text-base leading-6 text-white" : "text-base leading-6 text-slate-800 dark:text-white"}>
                      {message.text}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <View
          className="border-t border-slate-200 bg-white px-4 pb-1 pt-3 dark:border-dark-border dark:bg-dark-card"
          style={keyboardVisible ? { marginBottom: 72 } : undefined}
        >
          <View className="min-h-14 flex-row items-end gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-dark-border dark:bg-dark-bg">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={envoyerMessage}
              blurOnSubmit
              multiline
              placeholder="Écrivez votre question…"
              placeholderTextColor="#94a3b8"
              className="max-h-28 min-h-10 flex-1 py-2 text-base text-slate-900 dark:text-white"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Envoyer le message"
              onPress={envoyerMessage}
              disabled={!inputText.trim()}
              className={`mb-0.5 h-10 w-10 items-center justify-center rounded-full ${inputText.trim() ? "bg-teal-700" : "bg-slate-300 dark:bg-slate-600"}`}
            >
              <ArrowUp size={21} color="#fff" strokeWidth={2.5} />
            </Pressable>
          </View>
          <Text className="mt-2 text-center text-xs text-slate-400">Les réponses peuvent contenir des erreurs.</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
