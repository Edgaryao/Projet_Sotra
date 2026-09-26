import { Link } from "expo-router";
import { ArrowRight, UserRound } from "lucide-react-native";
import { ImageBackground, Text, View } from "react-native";
import Btn from "./components/Btn";
export default function index() {
  return (
    <ImageBackground
      className="flex-1"
      source={require("@/assets/images/acceuil_bg.png")}
      resizeMode="cover"
    >
      <View className="mt-12 rounded-xl items-center justify-center w-full mr-6 p-4 ">
        <Text className=" text-green-600 text-3xl font-bold mb-2  ">
          SOTRA GO
        </Text>
        <View className="flex-row gap-2 h-2">
          <View className="bg-green-600 w-32 h-full "></View>
        </View>
        <Text className="text-xl text-center text-white font-semibold mt-2">
          Explorez les lignes SOTRA et simplifiez vos déplacements à Abidjan.
        </Text>
      </View>
      <View className="flex-1 justify-end mx-6 gap-4 pb-8">
       
        <Btn
          color="bg-green-800"
          href={"/(tabs)/acceuil"}
        >
          COMMENCER
        </Btn>
        <View className="px-2">
          <Text className="text-center text-sm leading-5 text-white">
            En continuant, vous acceptez nos{" "}
            <Link href="/conditions" asChild>
              <Text className="text-blue-500 text-sm underline font-semibold">
                Conditions d’utilisation
              </Text>
            </Link>{" "}
            et notre{" "}
            <Link href="/confidentialite" asChild>
              <Text className="text-blue-500 text-sm underline font-semibold"
              
              >
                Politique de confidentialité
              </Text>
            </Link>
            .
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
