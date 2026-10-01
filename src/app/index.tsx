import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  Text,
  View,
} from "react-native";
import {
  synchronisationFaite,
} from "../database/synchornisation_supabase_sqlite";
import Btn from "./components/Btn";

export default function index() {
  const [isChecking, setIsChecking] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Vérification automatique au démarrage
  useEffect(() => {
    verifierStatut();
  }, []);

  const verifierStatut = async () => {
    try {
      console.log("🔍 Vérification de la synchronisation...");

      const dejaSynchronisee = await synchronisationFaite();

      if (dejaSynchronisee) {
        console.log("✅ Données présentes - Redirection vers l'accueil");
        // Données déjà présentes → aller directement à l'accueil
        router.replace("/(tabs)/acceuil");
      } else {
        console.log(
          "Première utilisation - Affichage de l'écran de bienvenue",
        );
        // Première utilisation → afficher l'écran de bienvenue
        setIsChecking(false);
        setShowWelcome(true);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
      // En cas d'erreur, afficher l'écran de bienvenue par sécurité
      setIsChecking(false);
      setShowWelcome(true);
    }
  };

  const commencer = () => {
    // Rediriger vers la page de synchronisation
    router.push("/synchronisation");
    
  };

  

  // Écran de chargement pendant la vérification
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

  // Écran de bienvenue (première utilisation uniquement)
  if (showWelcome) {
    return (
      <ImageBackground
        className="flex-1"
        source={require("@/assets/images/acceuil_bg.png")}
        resizeMode="cover"
      >
        <View className="mt-12 items-center justify-center rounded-xl p-4 mr-6 w-full">
          <Text className="mb-2 text-3xl font-bold text-green-600">
            SOTRA GO
          </Text>
          <View className="h-2 flex-row gap-2">
            <View className="h-full w-32 bg-green-600"></View>
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
