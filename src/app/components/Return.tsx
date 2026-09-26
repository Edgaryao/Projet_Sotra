import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable } from "react-native";

type ReturnProps = {
  size?: number;
};

const Return = ({ size = 34 }: ReturnProps) => {
  return (
    <Pressable
      onPress={() => {
        router.back();
      }}
    >
      <ArrowLeft size={size} />
    </Pressable>
  );
};

export default Return;
