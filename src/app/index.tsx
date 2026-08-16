import { Text, View } from "react-native";
export default function index() {
  return (
    <View className=" flex-1 justify-center">
      <View className="flex-row">
        <View className="flex-1/2 bg-red-400">
          <Text>Le logo de l'app</Text>
        </View>
        <View>
          <Text className="text-3xl">Alertes Citoyens</Text>
        </View>
      </View>
      <View>
        <Text>Un texte accrocheur </Text>
      </View>
      <View>
        <Text>Une image</Text>
      </View>
      <View>
        <Text>Se connecter</Text>
      </View>
      <View>
        <Text>Créer un compte</Text>
      </View>
      <View>
        <Text>Continuer sans compte</Text>
      </View>
      {/* <Link href="./accident_details">
        <View className="bg-green-700 p-4  rounded-full items-center">
          <Text>+ Details s</Text>
        </View>
      </Link>
      <Link href="/(tabs)/exploration">
        <View className="bg-green-700 p-4  rounded-full items-center">
          <Text>fil d'actualité</Text>
        </View>
      </Link> */}
    </View>
  );
}
