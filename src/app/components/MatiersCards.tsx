import { Href, router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
type PropsCard = {
  readonly children: React.ReactNode;
  readonly iconColor?: string;
  readonly Icon: React.ComponentType<{
    color: string;
    size?: number;
  }>;
  readonly fillColor?: string; // ✅ Corrigé : fillColor au lieu de fileColor
  readonly size?: number;
};

const MatiersCards = ({ children, size = 24, Icon }: PropsCard) => {
  const [isPressed, setIsPressed] = useState(false);
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable
      style={{
        opacity: isPressed ? 0.7 : 1,
      }}
      onPress={() =>
        router.push({
          pathname: "/choix/[id]",
          params: {
            id: String(children),
          },
        })
      }
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      className="h-[50px] w-full flex-none flex-row items-center justify-between rounded-2xl border-2 border-gray-300 bg-gray-200 dark:border-dark-border dark:bg-dark-card "  
    >
      <View className="flex-row items-center ml-4">
        <Icon
          size={24}
          color={colorScheme === "dark" ? "white" : "black"}
        />
        <Text className="font-inter-semibold text-center p-4 text-base dark:text-white">
          {children}
        </Text>
      </View>
      <View></View>
    </Pressable>
  );
};

export default MatiersCards;
