import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type BtnProps = {
  readonly href?: Href;
  readonly children: React.ReactNode;
  readonly onPress?: () => boolean | void | Promise<boolean | void>;
  readonly disabled?: boolean;
  readonly color?: string;
  readonly className?: string;
  readonly classNameText?: string;
  readonly leftIcon?: React.ReactNode;
  readonly rightIcon?: React.ReactNode;
};

const Btn = ({
  href,
  children,
  onPress,
  disabled,
  color,
  className,
  classNameText,
  leftIcon,
  rightIcon,
}: BtnProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const router = useRouter();

  const handlePress = async () => {
    if (href) {
      router.push(href);
    }
    await onPress?.();
  };

  return (
    <Pressable
      disabled={disabled}
      style={{
        opacity: disabled ? 0.5 : isPressed ? 0.8 : 1,
      }}
      onPress={handlePress}
      onPressIn={() => {
        if (!disabled) {
          setIsPressed(true);
        }
      }}
      onPressOut={() => {
        if (!disabled) {
          setIsPressed(false);
        }
      }}
      className={
        className ??
        `w-full  ${color} rounded-full justify-between items-center flex-row gap-4 p-5`
      }
    >
      <View className="w-10 items-center">{leftIcon}</View>
      <View className=" flex-row gap-4 ">
        {leftIcon}
        <Text
          className={
            classNameText ??
            "text-white font-semibold text-2xl font-inter-medium"
          }
        >
          {children}
        </Text>
      </View>

      <View className="mx-6">{rightIcon}</View>
    </Pressable>
  );
};

export default Btn;
