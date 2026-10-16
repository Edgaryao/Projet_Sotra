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
} from "@/database/detailsBus";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  BusFront,
  ChevronRight,
  Route,
  SlidersHorizontal,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
export default function Details() {
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
    async function chargerDetails() {
      try {
        setChargement(true);

        if (type === "parcours") {
          const parcoursId = Number(id);

          const parcours = await recupererParcours(parcoursId);

          const arrets = await recupererArretsParcours(parcoursId);
          console.log("🚏 Arrêts SQLite :", arrets);
          setParcoursDetail(parcours);
          setArretsParcours(arrets);

          console.log("📍 Parcours :", parcours);
          console.log("🚏 Arrêts :", arrets);
          console.log("🆔 ID reçu :", id);
          console.log("📌 Type reçu :", type);
          console.log("📍 Parcours SQLite :", parcours);
        }
        if (type === "ligne") {
          const ligneId = Number(id);

          const [numero, parcours] = await Promise.all([
            recupererNumeroLigne(ligneId),
            recupererParcoursLigne(ligneId),
          ]);

          setNumeroLigne(numero);
          setParcoursLigne(parcours);

          console.log("🚌 Ligne ID :", ligneId);
          console.log("🛣️ Parcours de la ligne :", parcours);
        }
        if (type === "arret") {
          const arretId = Number(id);

          const arret = await recupererArret(arretId);
          const lignes = await recupererLignesArret(arretId);

          setArretDetail(arret);
          setLignesArret(lignes);

          console.log("📍 Arrêt ID :", arretId);
          console.log("🚌 Lignes de l'arrêt :", lignes);
        }
      } catch (error) {
        console.error("❌ Erreur chargement détails :", error);
      } finally {
        setChargement(false);
      }
    }

    chargerDetails();
  }, [id, type]);
  const imageHeader =
    type === "arret"
      ? require("@/assets/images/arrêts.jpg")
      : require("@/assets/images/bus.jpg");

  return (
    <View className="flex-1 bg-white">
      {/* images  */}
      <ImageBackground
        source={imageHeader}
        resizeMode="cover"
        className="h-[260px] w-full"
      >
        <View className="flex-1">
          {/* BOUTON RETOUR */}

          <View className="px-5 pt-14">
            <Pressable
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-full bg-black/45"
            >
              <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>
        {(type !== "arret" || !chargement) && (
          <View className="w-full justify-end items-end">
            <View className="mr-4 mb-2 max-w-[85%] items-center justify-center rounded-xl bg-green-800 px-3 py-2">
              <Text className="text-center text-lg font-bold text-white">
                {type === "arret"
                  ? (arretDetail?.nom ?? "Arrêt introuvable")
                  : type === "ligne"
                    ? `Parcours du bus ${numeroLigne ?? "..."}`
                    : `Bus ${parcoursDetail?.numero_ligne ?? "..."}`}
              </Text>
            </View>
          </View>
        )}
      </ImageBackground>

      <View className="flex-1">
        {chargement && (
          <View className="flex-1 items-center justify-center px-5 py-10">
            <Text className="text-center text-base font-medium text-gray-600">
              Chargement ...
            </Text>
          </View>
        )}

        {/* lignes de bus  */}

        {!chargement && type === "parcours" && (
          <View className="flex-1">
            {/* TITRE */}

            {/* TRAJET */}

            <View className="px-5 py-6">
              <Text className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Trajet
              </Text>

              <View className="rounded-2xl border border-gray-200 p-5">
                {/* DÉPART */}

                <View className="flex-row">
                  <View className="mr-4 items-center">
                    <View className="h-3.5 w-3.5 rounded-full bg-green-600" />

                    <View className="h-12 w-px bg-gray-300" />
                  </View>

                  <View className="flex-1 pb-5">
                    <Text className="text-xs text-gray-500">Départ</Text>

                    <Text className="mt-1 text-base font-semibold text-gray-900">
                      {arretsParcours[0]?.nom ?? "Non renseigné"}
                    </Text>
                  </View>
                </View>

                {/* ARRIVÉE */}

                <View className="flex-row">
                  <View className="mr-4">
                    <View className="h-3.5 w-3.5 rounded-full border-2 border-red-500 bg-red-600" />
                  </View>

                  <View className="flex-1">
                    <Text className="text-xs text-gray-500">Arrivée</Text>

                    <Text className="mt-1 text-base font-semibold text-gray-900">
                      {arretsParcours[arretsParcours.length - 1]?.nom ??
                        "Non renseigné"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* ARRÊTS */}

            <View className="flex-1 px-5">
              <Text className="mb-4 text-xl font-bold text-gray-900">
                Arrêts du parcours
              </Text>

              <ScrollView
                className="flex-1"
                nestedScrollEnabled
                showsVerticalScrollIndicator
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                {arretsParcours.map((arret, index) => (
                  <Pressable
                    key={`${arret.id}-${index}`}
                    accessibilityRole="button"
                    onPress={() => {
                      router.push({
                        pathname: "/detailsBus/[id]",
                        params: { id: String(arret.id), type: "arret" },
                      });
                    }}
                    android_ripple={{ color: "#E5E7EB" }}
                    className="flex-row items-center border-b border-gray-100 py-4"
                  >
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                      <Text className="text-xs font-semibold text-gray-700">
                        {String(index + 1).padStart(2, "0")}
                      </Text>
                    </View>

                    <Text className="ml-4 flex-1 text-base font-medium text-gray-900">
                      {arret.nom}
                    </Text>

                    <ChevronRight size={18} color="#9CA3AF" />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {!chargement && type === "ligne" && (
          <View className="px-5 py-6">
            <Text className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Parcours disponibles
            </Text>

            {parcoursLigne.map((parcours) => (
              <Pressable
                key={parcours.id}
                className="mb-3 flex-row items-center rounded-2xl border border-gray-200 p-4"
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
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <Route size={21} color="#374151" strokeWidth={2} />
                </View>

                <Text className="ml-4 flex-1 text-base font-semibold text-gray-900">
                  {parcours.nom}
                </Text>

                <ChevronRight size={19} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>
        )}
        {!chargement && type === "arret" && (
          <View className="flex-1 px-5 pt-5">
            <Text className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Bus desservant cet arrêt
            </Text>

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {lignesArret.length === 0 ? (
                <Text className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                Aucun bus trouvé pour cet arrêt.
              </Text>
            ) : lignesArret.map((ligne, index) => (
              <Pressable
                key={`${ligne.id}-${index}`}
                className="mb-3 flex-row items-center rounded-2xl border border-gray-200 p-4"
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
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <BusFront size={21} color="#374151" strokeWidth={2} />
                </View>

                <View className="ml-4 flex-1">
                  <Text className="text-base font-semibold text-gray-900">
                    Bus {ligne.numero}
                  </Text>

                  <Text className="mt-1 text-sm text-gray-500">
                    {ligne.parcours_nom}
                  </Text>
                </View>

                <ChevronRight size={19} color="#9CA3AF" />
              </Pressable>
                  ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}
