import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  Text,
  View,
} from "react-native";
import Btn from "./components/Btn";

export default function Index() {
  const [isChecking, setIsChecking] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web") {
      router.replace("/(tabs)/acceuil");
      return;
    }

    void verifierStatutAndroid();
  }, []);

  const verifierStatutAndroid = async () => {
    try {
      const { synchronisationFaite } =
        await import("../database/synchornisation_supabase_sqlite.web");

      const dejaSynchronisee = await synchronisationFaite();

      if (dejaSynchronisee) {
        router.replace("/(tabs)/acceuil");
        return;
      }

      setShowWelcome(true);
    } catch (error) {
      console.error("Erreur lors de la vérification :", error);
      setShowWelcome(true);
    } finally {
      setIsChecking(false);
    }
  };

  const commencer = () => {
    router.push("/synchronisation");
  };

  if (isChecking) {
    return (
      <View className="flex-1 items-center justify-center bg-emerald-900">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="mt-4 text-base font-semibold text-white">
          Chargement...
        </Text>
      </View>
    );
  }

  if (showWelcome) {
    return (
      <ImageBackground
        className="flex-1"
        source={require("@/assets/images/acceuil_bg.png")}
        resizeMode="cover"
      >
        <View className="mr-6 mt-12 w-full items-center justify-center rounded-xl p-4">
          <Text className="mb-2 text-3xl font-bold text-green-600">
            SOTRA GO
          </Text>

          <View className="h-2 flex-row gap-2">
            <View className="h-full w-32 bg-green-600" />
          </View>

          <Text className="mt-2 text-center text-xl font-semibold text-white">
            Explorez les lignes SOTRA et simplifiez vos déplacements à Abidjan.
          </Text>
        </View>

        <View className="mx-6 flex-1 justify-end gap-4 pb-8">
          <Btn color="bg-green-800" onPress={commencer}>
            COMMENCER
          </Btn>

          <View className="px-2">
            <Text className="text-center text-sm leading-5 text-white">
              En continuant, vous acceptez nos{" "}
              <Text
                className="text-sm font-semibold text-blue-500 underline"
                onPress={() => router.push("/conditions")}
              >
                Conditions d'utilisation
              </Text>{" "}
              et notre{" "}
              <Text
                className="text-sm font-semibold text-blue-500 underline"
                onPress={() => router.push("/confidentialite")}
              >
                Politique de confidentialité
              </Text>
              .
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return null;
}
