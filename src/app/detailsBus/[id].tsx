import {
  recupererArret,
  recupererArretsParcours,
  recupererLignesArret,
  recupererNumeroLigne,
  recupererParcours,
  recupererParcoursLigne,
  type ArretDetail,
  type LigneArretDetail,
  type ParcoursDetail,
  type ParcoursLigneDetail,
} from "@/database/detailsBus.web";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  BusFront,
  ChevronRight,
  House,
  Route,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Details() {
  const { colorScheme } = useColorScheme();
  const modeSombre = colorScheme === "dark";

  const { width } = useWindowDimensions();

  const estWeb = width >= 768;
  const estGrandEcran = width >= 1024;

  const largeurContenu = estGrandEcran ? 900 : estWeb ? 720 : "100%";

  const hauteurHeader = width < 380 ? 190 : width < 768 ? 220 : 300;

  const paddingHorizontal = width < 380 ? 14 : width < 768 ? 20 : 28;

  const [parcoursDetail, setParcoursDetail] = useState<ParcoursDetail | null>(
    null,
  );
  const [numeroLigne, setNumeroLigne] = useState<string | null>(null);
  const [parcoursLigne, setParcoursLigne] = useState<ParcoursLigneDetail[]>([]);
  const [arretsParcours, setArretsParcours] = useState<ArretDetail[]>([]);
  const [arretDetail, setArretDetail] = useState<ArretDetail | null>(null);
  const [lignesArret, setLignesArret] = useState<LigneArretDetail[]>([]);
  const [chargement, setChargement] = useState(true);

  const { id, type } = useLocalSearchParams<{
    id: string;
    type: "ligne" | "parcours" | "arret";
  }>();

  useEffect(() => {
    let actif = true;

    async function chargerDetails() {
      try {
        setChargement(true);

        if (type === "parcours") {
          const parcoursId = Number(id);

          const [parcours, arrets] = await Promise.all([
            recupererParcours(parcoursId),
            recupererArretsParcours(parcoursId),
          ]);

          if (!actif) return;

          setParcoursDetail(parcours);
          setArretsParcours(arrets);
        } else if (type === "ligne") {
          const ligneId = Number(id);

          const [numero, parcours] = await Promise.all([
            recupererNumeroLigne(ligneId),
            recupererParcoursLigne(ligneId),
          ]);

          if (!actif) return;

          setNumeroLigne(numero);
          setParcoursLigne(parcours);
        } else if (type === "arret") {
          const arretId = Number(id);

          const [arret, lignes] = await Promise.all([
            recupererArret(arretId),
            recupererLignesArret(arretId),
          ]);

          if (!actif) return;

          setArretDetail(arret);
          setLignesArret(lignes);
        }
      } catch (error) {
        console.error("Erreur chargement détails :", error);
      } finally {
        if (actif) setChargement(false);
      }
    }

    void chargerDetails();

    return () => {
      actif = false;
    };
  }, [id, type]);

  const imageHeader =
    type === "arret"
      ? require("@/assets/images/arrêts.jpg")
      : require("@/assets/images/bus.jpg");

  const couleurTexte = modeSombre ? "#FFFFFF" : "#111827";
  const couleurSecondaire = modeSombre ? "#A3A3A3" : "#6B7280";

  const fondCarte = modeSombre ? "#1E1E1E" : "#FFFFFF";
  const couleurBordure = modeSombre ? "#3A3A3A" : "#E5E7EB";

  const titre =
    type === "arret"
      ? (arretDetail?.nom ?? "Arrêt introuvable")
      : type === "ligne"
        ? `Parcours du bus ${numeroLigne ?? "..."}`
        : `Bus ${parcoursDetail?.numero_ligne ?? "..."}`;

  return (
    <View className="flex-1 bg-white dark:bg-dark-background">
      <ImageBackground
        source={imageHeader}
        resizeMode="cover"
        style={{ height: hauteurHeader, width: "100%" }}
      >
        <SafeAreaView className="flex-1" edges={["top"]}>
          <View
            className="flex-row items-center justify-between pt-3"
            style={{ paddingHorizontal }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retour"
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-full bg-black/45"
            >
              <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.2} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Accueil"
              onPress={() => router.replace("/(tabs)/acceuil")}
              className="h-11 w-11 items-center justify-center rounded-full bg-white/90"
              android_ripple={{
                color: "rgba(0, 0, 0, 0.12)",
              }}
            >
              <House size={21} color="#166534" />
            </Pressable>
          </View>
        </SafeAreaView>

        {(type !== "arret" || !chargement) && (
          <View className="w-full flex-1 items-end justify-end">
            <View
              className="mb-3 rounded-xl bg-green-800 px-3 py-2"
              style={{
                marginHorizontal: paddingHorizontal,
                maxWidth: width < 380 ? "90%" : "85%",
              }}
            >
              <Text
                className="text-center font-bold text-white"
                style={{ fontSize: width < 380 ? 15 : 18 }}
              >
                {titre}
              </Text>
            </View>
          </View>
        )}
      </ImageBackground>

      <View className="flex-1 bg-white dark:bg-dark-background">
        <View
          className="flex-1 self-center"
          style={{
            width: largeurContenu,
            maxWidth: "100%",
          }}
        >
          {chargement && (
            <View className="flex-1 items-center justify-center px-5 py-10">
              <Text className="text-center text-base font-medium text-gray-600 dark:text-gray-400">
                Chargement...
              </Text>
            </View>
          )}

          {!chargement && type === "parcours" && (
            <View className="flex-1">
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal,
                  paddingTop: width < 768 ? 20 : 28,
                  paddingBottom: 24,
                  flexGrow: 1,
                }}
              >
                <Text className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Trajet
                </Text>

                <View
                  className="mb-6 rounded-2xl border p-5 dark:border-dark-border dark:bg-dark-card"
                  style={{
                    borderColor: couleurBordure,
                    backgroundColor: fondCarte,
                  }}
                >
                  <View className="flex-row">
                    <View className="mr-4 items-center">
                      <View className="h-3.5 w-3.5 rounded-full bg-green-600" />
                      <View className="h-12 w-px bg-gray-300 dark:bg-dark-border" />
                    </View>

                    <View className="flex-1 pb-5">
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        Départ
                      </Text>

                      <Text className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                        {arretsParcours[0]?.nom ?? "Non renseigné"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row">
                    <View className="mr-4">
                      <View className="h-3.5 w-3.5 rounded-full border-2 border-red-500 bg-red-600" />
                    </View>

                    <View className="flex-1">
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        Arrivée
                      </Text>

                      <Text className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                        {arretsParcours[arretsParcours.length - 1]?.nom ??
                          "Non renseigné"}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  Arrêts du parcours
                </Text>

                {arretsParcours.length === 0 ? (
                  <Text className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500 dark:bg-dark-card dark:text-gray-400">
                    Aucun arrêt trouvé pour ce parcours.
                  </Text>
                ) : (
                  arretsParcours.map((arret, index) => (
                    <Pressable
                      key={`${arret.id}-${index}`}
                      accessibilityRole="button"
                      onPress={() => {
                        router.push({
                          pathname: "/detailsBus/[id]",
                          params: {
                            id: String(arret.id),
                            type: "arret",
                          },
                        });
                      }}
                      android_ripple={{
                        color: modeSombre
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.12)",
                      }}
                      className="flex-row items-center border-b border-gray-100 py-4 dark:border-dark-border"
                    >
                      <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-card">
                        <Text className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                          {String(index + 1).padStart(2, "0")}
                        </Text>
                      </View>

                      <Text className="ml-4 flex-1 text-base font-medium text-gray-900 dark:text-white">
                        {arret.nom}
                      </Text>

                      <ChevronRight size={18} color={couleurSecondaire} />
                    </Pressable>
                  ))
                )}
              </ScrollView>
            </View>
          )}

          {!chargement && type === "ligne" && (
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal,
                paddingVertical: width < 768 ? 20 : 28,
                paddingBottom: 30,
              }}
            >
              <Text className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Parcours disponibles
              </Text>

              {parcoursLigne.length === 0 ? (
                <Text className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500 dark:bg-dark-card dark:text-gray-400">
                  Aucun parcours trouvé pour cette ligne.
                </Text>
              ) : (
                parcoursLigne.map((parcours) => (
                  <Pressable
                    key={parcours.id}
                    accessibilityRole="button"
                    android_ripple={{
                      color: modeSombre
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.12)",
                    }}
                    className="mb-3 flex-row items-center rounded-2xl border border-gray-200 bg-white p-4 dark:border-dark-border dark:bg-dark-card"
                    onPress={() => {
                      router.push({
                        pathname: "/detailsBus/[id]",
                        params: {
                          id: String(parcours.id),
                          type: "parcours",
                        },
                      });
                    }}
                  >
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-dark-background">
                      <Route
                        size={21}
                        color={modeSombre ? "#D1D5DB" : "#374151"}
                        strokeWidth={2}
                      />
                    </View>

                    <Text className="ml-4 flex-1 text-base font-semibold text-gray-900 dark:text-white">
                      {parcours.nom}
                    </Text>

                    <ChevronRight size={19} color={couleurSecondaire} />
                  </Pressable>
                ))
              )}
            </ScrollView>
          )}

          {!chargement && type === "arret" && (
            <View className="flex-1 pt-5" style={{ paddingHorizontal }}>
              <Text className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Bus desservant cet arrêt
              </Text>

              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                {lignesArret.length === 0 ? (
                  <Text className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500 dark:bg-dark-card dark:text-gray-400">
                    Aucun bus trouvé pour cet arrêt.
                  </Text>
                ) : (
                  lignesArret.map((ligne, index) => (
                    <Pressable
                      key={`${ligne.id}-${index}`}
                      accessibilityRole="button"
                      android_ripple={{
                        color: modeSombre
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.12)",
                      }}
                      className="mb-3 flex-row items-center rounded-2xl border border-gray-200 bg-white p-4 dark:border-dark-border dark:bg-dark-card"
                      onPress={() => {
                        router.push({
                          pathname: "/detailsBus/[id]",
                          params: {
                            id: String(ligne.id),
                            type: "ligne",
                          },
                        });
                      }}
                    >
                      <View className="h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-dark-background">
                        <BusFront
                          size={21}
                          color={modeSombre ? "#D1D5DB" : "#374151"}
                          strokeWidth={2}
                        />
                      </View>

                      <View className="ml-4 flex-1">
                        <Text className="text-base font-semibold text-gray-900 dark:text-white">
                          Bus {ligne.numero}
                        </Text>

                        <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {ligne.parcours_nom}
                        </Text>
                      </View>

                      <ChevronRight size={19} color={couleurSecondaire} />
                    </Pressable>
                  ))
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
