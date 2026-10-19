import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { Check, WifiOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import {
  getEtatSynchronisation,
  syncArrets,
  syncLignes,
  syncParcours,
  syncParcoursArrets,
  terminerSynchronisation,
} from "../database/synchornisation_supabase_sqlite.web";
type EtatSynchronistion = "enSynchro" | "success" | "erreur";

export default function Synchronisation() {
  const [EtatSynchronistion, setEtatSynchronistion] =
    useState<EtatSynchronistion>("enSynchro");
  const [ProgresionSynchro, setProgresionSynchro] = useState("");
  const [PourcentageProgression, setPourcentageProgression] = useState(0);
  const [MessageErreur, setMessageErreur] = useState("");

  useEffect(() => {
    lancerSynchronisation();
  }, []);

  // Fonction pour vérifier la connexion Internet
  const verifierConnexion = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.from("lignes").select("id").limit(1);

      if (error) {
        console.error("❌ Supabase inaccessible :", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Erreur connexion :", error);
      return false;
    }
  };

  const lancerSynchronisation = async () => {
    try {
      setEtatSynchronistion("enSynchro");

      // Vérifier la connexion avant de commencer
      const isConnected = await verifierConnexion();
      if (!isConnected) {
        setMessageErreur("Aucune connexion Internet détectée");
        setEtatSynchronistion("erreur");
        return;
      }

      try {
        // Récupérer l'état de la synchronisation pour reprendre là où on s'était arrêté
        const etat = await getEtatSynchronisation();
        console.log("État de la synchro:", etat);

        // synchronisation des lignes
        if (etat.lignes_ok === 0) {
          setProgresionSynchro("Téléchargement des lignes...");
          setPourcentageProgression(10);
          await Promise.race([
            syncLignes(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Timeout")), 60000),
            ),
          ]);
          console.log("✅ Lignes synchronisées");
        } else {
          console.log("⏭️ Lignes déjà synchronisées, on passe...");
        }
        setPourcentageProgression(25);

        // Étape 2 : Parcours (25% → 50%)
        if (etat.parcours_ok === 0) {
          setProgresionSynchro("Téléchargement des parcours...");
          setPourcentageProgression(35);
          await Promise.race([
            syncParcours(),
            new Promise(
              (_, reject) =>
                setTimeout(() => reject(new Error("Timeout")), 60000), // 60s
            ),
          ]);
          console.log("✅ Parcours synchronisés");
        } else {
          console.log("⏭️ Parcours déjà synchronisés, on passe...");
        }
        setPourcentageProgression(50);

        // Étape 3 : Arrêts (50% → 75%) - 858 arrêts = plus long
        if (etat.arrets_ok === 0) {
          setProgresionSynchro("Téléchargement des arrêts...");
          setPourcentageProgression(60);
          await Promise.race([
            syncArrets(),
            new Promise(
              (_, reject) =>
                setTimeout(() => reject(new Error("Timeout")), 120000), // 120s (2 minutes)
            ),
          ]);
          console.log("✅ Arrêts synchronisés");
        } else {
          console.log(" Arrêts déjà synchronisés, on passe...");
        }
        setPourcentageProgression(75);

        // Étape 4 : Itinéraires (75% → 95%)
        if (etat.parcours_arrets_ok === 0) {
          setProgresionSynchro("Téléchargement des itinéraires...");
          setPourcentageProgression(85);
          await Promise.race([
            syncParcoursArrets(),
            new Promise(
              (_, reject) =>
                setTimeout(() => reject(new Error("Timeout")), 120000), // 90s
            ),
          ]);
          console.log("✅ Itinéraires synchronisés");
        } else {
          console.log("Itinéraires déjà synchronisés, on passe...");
        }
        setPourcentageProgression(95);

        // Marquer comme terminé
        await terminerSynchronisation();
        setPourcentageProgression(100);
        setProgresionSynchro("Synchronisation terminée !");

        console.log("✅ Synchronisation complète réussie");
        setEtatSynchronistion("success");

        // Redirection après 1 seconde
        setTimeout(() => {
          router.replace("/(tabs)/acceuil");
        }, 1000);
      } catch (syncError: any) {
        console.error("Erreur pendant la synchronisation:", syncError);

        // Vérifier si c'est un problème de connexion
        const stillConnected = await verifierConnexion();

        // Message en fonction de l'erreur et de l'état actuel
        let message = "";
        const etapeEnCours = ProgresionSynchro;

        if (syncError.message === "Timeout") {
          message = `Le téléchargement a pris trop de temps pendant : ${etapeEnCours}\n\n`;
        } else if (
          syncError.code === "42501" ||
          syncError.message?.toLowerCase().includes("permission") ||
          syncError.message?.toLowerCase().includes("row-level security")
        ) {
          message = `Erreur d'autorisation lors de : ${etapeEnCours}\n\n`;
        } else if (!stillConnected) {
          message = `La connexion Internet semble avoir été perdue pendant : ${etapeEnCours}\n\n`;
        } else {
          message = `Une erreur s'est produite pendant : ${etapeEnCours}\n\n`;
        }

        message +=
          "Votre progression a été sauvegardée. Cliquez sur « Réessayer » pour continuer.";

        setMessageErreur(message);
        setEtatSynchronistion("erreur");
      }
    } catch (error) {
      console.error("Erreur critique:", error);
      setMessageErreur(
        "Une erreur inattendue s'est produite. Veuillez réessayer ou contacter le support si le problème persiste.",
      );
      setEtatSynchronistion("erreur");
    }
  };

  const reessayer = () => {
    lancerSynchronisation();
  };

  // État : Synchronisation en cours
  if (EtatSynchronistion === "enSynchro") {
    return (
      <View className="flex-1 items-center justify-center bg-emerald-900 px-8">
        <View className="w-full items-center">
          {/* Spinner */}
          <ActivityIndicator size="large" color="#10B981" />

          {/* Message explicatif */}
          <Text className="mt-6 text-center text-base leading-6 text-emerald-100">
            Nous téléchargeons les données pour que vous puissiez utiliser
            l'application sans connexion
          </Text>

          {/* Étape en cours */}
          <Text className="mt-8 text-center text-sm font-medium text-white">
            {ProgresionSynchro}
          </Text>

          {/* Pourcentage */}
          <Text className="mt-2 text-4xl font-extrabold text-white">
            {PourcentageProgression}%
          </Text>

          {/* Info */}
          <Text className="mt-6 text-center text-xs text-emerald-300">
            Selon votre connexion, cela peut prendre quelques instants
          </Text>
        </View>
      </View>
    );
  }

  // État : Synchronisation réussie
  if (EtatSynchronistion === "success") {
    return (
      <View className="flex-1 items-center justify-center bg-emerald-900">
        <View className="items-center px-8">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-emerald-500">
            <Check color="white" size={48} strokeWidth={3} />
          </View>
          <Text className="text-2xl font-extrabold text-white">
            Tout est prêt !
          </Text>
          <Text className="mt-2 text-center text-base text-emerald-100">
            Redirection vers l'application...
          </Text>
        </View>
      </View>
    );
  }

  // État : Erreur
  if (EtatSynchronistion === "erreur") {
    return (
      <View className="flex-1 items-center justify-center bg-emerald-900 px-6">
        <View className="items-center">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-red-500/20">
            <WifiOff color="#EF4444" size={48} strokeWidth={2} />
          </View>
          <Text className="text-2xl font-extrabold text-white">
            Synchronisation interrompue
          </Text>
          <Text className="mt-4 text-center text-base leading-7 text-emerald-100">
            {MessageErreur}
          </Text>

          {PourcentageProgression > 0 && (
            <View className="mt-4">
              <Text className="text-center text-sm text-emerald-200">
                Progression avant interruption : {PourcentageProgression}%
              </Text>
            </View>
          )}

          <Pressable
            onPress={reessayer}
            className="mt-8 w-full items-center rounded-2xl bg-white p-4"
          >
            <Text className="text-lg font-semibold text-emerald-900">
              Réessayer
            </Text>
          </Pressable>

          <Pressable onPress={() => router.replace("/")}>
            <Text className="mt-4 text-sm font-semibold text-white underline">
              Retour à l'accueil
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return null;
}
