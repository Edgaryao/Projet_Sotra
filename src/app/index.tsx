import { Link } from "expo-router";
import { Text, View } from "react-native";
export default function index() {
  return (
    <View className=" flex-1 justify-center">
      <Link href="./accident_details">
        <View className="bg-green-700 p-4  rounded-full items-center">
          <Text>+ Details s</Text>
        </View>
      </Link>
      <Link href="./exploration">
        <View className="bg-green-700 p-4  rounded-full items-center">
          <Text>fil d'actualité</Text>
        </View>
      </Link>
    </View>
  );
}
