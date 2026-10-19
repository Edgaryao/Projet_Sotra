import * as Location from "expo-location";
import { router } from "expo-router";
import {
  BusFront,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClockFading,
  LocateFixed,
  MapPin,
  Moon,
  Route,
  Search,
  SlidersHorizontal,
  Sun,
  X,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  ImageBackground,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  recupererArretsAvecCoordonnees,
  type ArretDetail,
} from "../../database/detailsBus.web";
import {
  rechercherBus,
  type ResultatRecherche,
} from "../../database/recherche";
import {
  ajouterRechercheRecente,
  recupererRecherchesRecentes,
  supprimerRecherchesRecentes,
} from "../../database/recherchesRecentes";

type FiltreType = "tous" | "ligne" | "arret" | "parcours";
type ArretProche = ArretDetail & { distanceMetres: number };

const filtres: { valeur: FiltreType; libelle: string }[] = [
  { valeur: "tous", libelle: "Tous" },
  { valeur: "ligne", libelle: "Bus" },
  { valeur: "arret", libelle: "Arrêt" },
  { valeur: "parcours", libelle: "Parcours" },
];

export default function acceuil() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const modeSombre = colorScheme === "dark";

  const [modalEffacerVisible, setModalEffacerVisible] = useState(false);
  const [modalArretsProchesVisible, setModalArretsProchesVisible] =
    useState(false);
  const [chargementArretsProches, setChargementArretsProches] = useState(false);
  const [arretsProches, setArretsProches] = useState<ArretProche[]>([]);
  const [voirArretsProche, setVoirArretsProche] = useState(false);
  const [changeTheme, setChangeTheme] = useState(false);
  const [voirTout, setVoirTout] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [afficherHistoriqueComplet, setAfficherHistoriqueComplet] =
    useState(false);
  const [parameter, setparameter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtreType, setFiltreType] = useState<FiltreType>("tous");
  const [filtresVisibles, setFiltresVisibles] = useState(false);
  const [resultatsRecherche, setResultatsRecherche] = useState<
    ResultatRecherche[]
  >([]);
  const [rechercheEnCours, setRechercheEnCours] = useState(false);
  const [recherchesRecentes, setRecherchesRecentes] = useState<string[]>([]);

  const resultatsFiltres = resultatsRecherche.filter(
    (item) => filtreType === "tous" || item.type === filtreType,
  );

  const recherchesVisibles = afficherHistoriqueComplet
    ? recherchesRecentes
    : recherchesRecentes.slice(0, 4);

  useEffect(() => {
    void chargerRecherchesRecentes();
  }, []);

  const chargerRecherchesRecentes = async () => {
    const recherches = await recupererRecherchesRecentes();
    setRecherchesRecentes(recherches);
  };

  const basculerHistoriqueComplet = () => {
    setAfficherHistoriqueComplet((affiche) => !affiche);
  };

  const trouverArretsProches = async () => {
    setModalArretsProchesVisible(true);
    setChargementArretsProches(true);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setModalArretsProchesVisible(false);
        Alert.alert(
          "Localisation requise",
          "Autorisez l'accès à votre position pour trouver les arrêts proches.",
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const arrets = await recupererArretsAvecCoordonnees();
      const { latitude, longitude } = position.coords;
      const rayonTerre = 6371000;
      const radians = (degres: number) => (degres * Math.PI) / 180;

      const proches = arrets
        .filter((arret) => arret.latitude != null && arret.longitude != null)
        .map((arret) => {
          const latitudeArret = arret.latitude!;
          const longitudeArret = arret.longitude!;
          const differenceLatitude = radians(latitudeArret - latitude);
          const differenceLongitude = radians(longitudeArret - longitude);

          const calcul =
            Math.sin(differenceLatitude / 2) ** 2 +
            Math.cos(radians(latitude)) *
              Math.cos(radians(latitudeArret)) *
              Math.sin(differenceLongitude / 2) ** 2;

          const distanceMetres = 2 * rayonTerre * Math.asin(Math.sqrt(calcul));

          return { ...arret, distanceMetres };
        })
        .filter((arret) => arret.distanceMetres <= 5000)
        .sort((a, b) => a.distanceMetres - b.distanceMetres);

      setArretsProches(proches);
    } catch (error) {
      setModalArretsProchesVisible(false);
      console.error("Nearby stop lookup failed:", error);

      Alert.alert(
        "Localisation indisponible",
        "Impossible de récupérer votre position. Vérifiez que la localisation est active, puis réessayez.",
      );
    } finally {
      setChargementArretsProches(false);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchMode(true);
  };

  useEffect(() => {
    if (!isSearchMode) return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleSearchClose();
        return true;
      },
    );

    return () => subscription.remove();
  }, [isSearchMode]);

  const handleSearchClose = () => {
    setIsSearchMode(false);
    setSearchQuery("");
    setResultatsRecherche([]);
    setVoirTout(false);
    Keyboard.dismiss();
  };

  const handleSearchChange = (texte: string) => {
    setVoirTout(false);
    void effectuerRecherche(texte, false);
  };

  const effectuerRecherche = async (texte: string, afficherTout = false) => {
    setSearchQuery(texte);

    if (!texte.trim()) {
      setResultatsRecherche([]);
      setRechercheEnCours(false);
      return;
    }

    try {
      setRechercheEnCours(true);

      const resultats = await rechercherBus(
        texte,
        afficherTout ? undefined : 20,
        filtreType,
      );

      setResultatsRecherche(resultats);
    } catch (error) {
      console.error("Erreur recherche SQLite :", error);
      setResultatsRecherche([]);

      Alert.alert("Erreur", "Impossible d'effectuer la recherche. Réessayez.");
    } finally {
      setRechercheEnCours(false);
    }
  };

  const confirmerSuppressionHistorique = async () => {
    try {
      await supprimerRecherchesRecentes();
      setRecherchesRecentes([]);
      setModalEffacerVisible(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'historique :", error);
      Alert.alert("Erreur", "Impossible de supprimer les recherches récentes.");
    }
  };

  const couleurTexte = modeSombre ? "#FFFFFF" : "#111827";
  const couleurTexteSecondaire = modeSombre ? "#A3A3A3" : "#6B7280";
  const couleurCarte = modeSombre ? "#1E1E1E" : "#F9FAFB";
  const couleurBordure = modeSombre ? "#3A3A3A" : "#E5E7EB";

  const modalSuppression = (
    <Modal
      visible={modalEffacerVisible}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="fade"
      onRequestClose={() => setModalEffacerVisible(false)}
    >
      <View className="flex-1 items-center justify-center bg-black/60 px-6">
        <View className="w-full rounded-3xl border border-gray-200 bg-white p-6 dark:border-dark-border dark:bg-dark-card">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Effacer les recherches ?
          </Text>

          <Text className="mt-2 text-sm leading-5 text-gray-500 dark:text-gray-400">
            Voulez-vous vraiment supprimer toutes vos recherches récentes ?
          </Text>

          <View className="mt-6 flex-row gap-3">
            <Pressable
              onPress={() => setModalEffacerVisible(false)}
              className="flex-1 items-center rounded-xl bg-gray-100 py-3 dark:bg-dark-background"
            >
              <Text className="font-semibold text-gray-700 dark:text-gray-200">
                Annuler
              </Text>
            </Pressable>

            <Pressable
              onPress={() => void confirmerSuppressionHistorique()}
              className="flex-1 items-center rounded-xl bg-red-500 py-3"
            >
              <Text className="font-semibold text-white">Effacer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (!isSearchMode) {
    return (
      <ImageBackground
        source={
          modeSombre
            ? require("../../../assets/images/bg-dark.png")
            : require("../../../assets/images/background.png")
        }
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1 px-5 pt-3">
          <View className="mb-8 flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <Text className="text-xl font-extrabold text-gray-900 drop-shadow-lg dark:text-white">
                SOTRA GO
              </Text>

              <Text className="text-xs font-semibold tracking-wider text-gray-700 dark:text-white">
                ABIDJAN
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Changer le thème"
              style={{
                opacity: parameter ? 0.85 : 1,
                transform: [{ scale: parameter ? 0.98 : 1 }],
              }}
              onPressIn={() => setparameter(true)}
              onPressOut={() => setparameter(false)}
              onPress={() => {
                setChangeTheme(!changeTheme);
                toggleColorScheme();
              }}
            >
              {modeSombre ? (
                <Sun color="#FFFFFF" size={22} />
              ) : (
                <Moon color="#111827" size={22} />
              )}
            </Pressable>
          </View>

          <View className="mb-6">
            <Text className="text-4xl font-extrabold leading-tight text-gray-900 drop-shadow-lg dark:text-white">
              Où souhaitez-vous aller ?
            </Text>

            <Text className="mt-3 text-base leading-6 text-gray-700 dark:text-gray-200">
              Trouvez une ligne ou un arrêt pour votre trajet.
            </Text>
          </View>

          <Pressable onPress={handleSearchFocus}>
            <View className="h-16 flex-row items-center gap-3 rounded-2xl border border-transparent bg-white px-5 shadow-2xl shadow-black/30 dark:border-dark-border dark:bg-dark-card">
              <Search color="#10B981" size={22} strokeWidth={2.5} />

              <Text className="flex-1 text-base font-medium text-gray-400">
                Numéro de bus, ligne, arrêt...
              </Text>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            className="mt-4 min-h-14 flex-row items-center gap-3 rounded-2xl bg-emerald-600 px-5 shadow-xl shadow-emerald-900/40"
            style={{
              opacity: voirArretsProche ? 0.85 : 1,
              transform: [{ scale: voirArretsProche ? 0.98 : 1 }],
            }}
            onPressIn={() => setVoirArretsProche(true)}
            onPressOut={() => setVoirArretsProche(false)}
            onPress={() => void trouverArretsProches()}
          >
            <LocateFixed color="white" size={22} strokeWidth={2.5} />

            <Text className="flex-1 text-sm font-bold text-white">
              Trouver les arrêts autour de moi
            </Text>

            <ChevronRight color="white" size={22} strokeWidth={2.5} />
          </Pressable>

          <View className="mt-64 flex-1">
            <View className="mt-8"></View>
            {recherchesRecentes.length > 0 && (
              <View className="mt-6">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-gray-900 dark:text-white">
                    Recherches récentes
                  </Text>

                  <Pressable onPress={() => setModalEffacerVisible(true)}>
                    <Text className="text-sm font-medium text-emerald-600">
                      Effacer
                    </Text>
                  </Pressable>
                </View>

                <View className="gap-2">
                  {recherchesRecentes.slice(0, 4).map((recherche, index) => (
                    <Pressable
                      key={`${recherche}-${index}`}
                      onPress={() => {
                        setIsSearchMode(true);
                        void effectuerRecherche(recherche, false);
                      }}
                      className="flex-row items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-dark-card"
                    >
                      <ClockFading
                        color={couleurTexteSecondaire}
                        size={19}
                        strokeWidth={2}
                      />

                      <Text className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {recherche}
                      </Text>

                      <ChevronRight color="#9CA3AF" size={18} />
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>

          {modalSuppression}

          <Modal
            visible={modalArretsProchesVisible}
            transparent
            statusBarTranslucent
            navigationBarTranslucent
            animationType="slide"
            onRequestClose={() => setModalArretsProchesVisible(false)}
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className="max-h-[80%] rounded-t-3xl border-t border-gray-200 bg-white px-5 pb-8 pt-5 dark:border-dark-border dark:bg-dark-background">
                <View className="mb-4 flex-row items-center justify-between">
                  <View>
                    <Text className="text-xl font-bold text-gray-900 dark:text-white">
                      Arrêts autour de moi
                    </Text>

                    <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Dans un rayon de 5 km
                    </Text>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Fermer les arrêts proches"
                    onPress={() => setModalArretsProchesVisible(false)}
                    className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-card"
                  >
                    <X color={couleurTexte} size={20} />
                  </Pressable>
                </View>

                {chargementArretsProches ? (
                  <Text className="py-8 text-center text-gray-500 dark:text-gray-400">
                    Recherche des arrêts proches...
                  </Text>
                ) : arretsProches.length === 0 ? (
                  <Text className="py-8 text-center text-gray-500 dark:text-gray-400">
                    Aucun arrêt avec coordonnées trouvé dans un rayon de 5 km.
                  </Text>
                ) : (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {arretsProches.map((arret) => (
                      <Pressable
                        key={arret.id}
                        accessibilityRole="button"
                        android_ripple={{
                          color: modeSombre
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.12)",
                        }}
                        onPress={() => {
                          setModalArretsProchesVisible(false);
                          router.push({
                            pathname: "/detailsBus/[id]",
                            params: {
                              id: String(arret.id),
                              type: "arret",
                            },
                          });
                        }}
                        className="mb-2 flex-row items-center rounded-xl bg-gray-50 p-4 dark:bg-dark-card"
                      >
                        <LocateFixed color="#059669" size={20} />

                        <Text className="ml-3 flex-1 text-sm font-semibold text-gray-800 dark:text-white">
                          {arret.nom}
                        </Text>

                        <Text className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                          {arret.distanceMetres < 1000
                            ? `${Math.round(arret.distanceMetres)} m`
                            : `${(arret.distanceMetres / 1000).toFixed(1)} km`}
                        </Text>

                        <ChevronRight color="#9CA3AF" size={18} />
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      className="flex-1 bg-white dark:bg-dark-background"
    >
      <SafeAreaView className="flex-1">
        <View className="border-b border-gray-200 bg-white px-4 py-3 dark:border-dark-border dark:bg-dark-background">
          <View className="flex-row items-center gap-3">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fermer la recherche"
              onPress={handleSearchClose}
              className="h-10 w-10 items-center justify-center"
            >
              <X color={couleurTexte} size={24} strokeWidth={2.5} />
            </Pressable>

            <View className="flex-1 flex-row items-center gap-3 rounded-xl bg-gray-100 px-4 py-3 dark:bg-dark-card">
              <Search color="#10B981" size={20} strokeWidth={2.5} />

              <TextInput
                autoFocus
                value={searchQuery}
                onChangeText={handleSearchChange}
                className="flex-1 text-base font-medium text-gray-900 dark:text-white"
                placeholder="Rechercher une ligne de bus, un arrêt..."
                placeholderTextColor="#9CA3AF"
              />

              {searchQuery.length > 0 && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Effacer la recherche"
                  onPress={() => {
                    setSearchQuery("");
                    setResultatsRecherche([]);
                    setVoirTout(false);
                  }}
                >
                  <X color="#9CA3AF" size={18} strokeWidth={2.5} />
                </Pressable>
              )}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Afficher les filtres"
                onPress={() => setFiltresVisibles((visibles) => !visibles)}
                className={`h-9 w-9 items-center justify-center rounded-lg ${
                  filtreType !== "tous"
                    ? "bg-emerald-100 dark:bg-emerald-900"
                    : "bg-white dark:bg-dark-background"
                }`}
              >
                <SlidersHorizontal
                  color={
                    filtreType !== "tous" ? "#047857" : couleurTexteSecondaire
                  }
                  size={20}
                  strokeWidth={2.2}
                />
              </Pressable>
            </View>
          </View>

          {filtresVisibles && (
            <View className="mt-3 border-t border-gray-100 pt-3 dark:border-dark-border">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-gray-700 dark:text-white">
                  Filtrer par
                </Text>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fermer les filtres"
                  onPress={() => setFiltresVisibles(false)}
                  className="px-2 py-1"
                >
                  <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Fermer
                  </Text>
                </Pressable>
              </View>

              <View className="flex-row gap-2">
                {filtres.map((filtre) => (
                  <Pressable
                    key={filtre.valeur}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: filtreType === filtre.valeur,
                    }}
                    onPress={() => {
                      setFiltreType(filtre.valeur);
                      if (searchQuery.trim()) {
                        void effectuerRecherche(searchQuery, voirTout);
                      }
                    }}
                    className={`flex-1 items-center rounded-lg border px-2 py-2 ${
                      filtreType === filtre.valeur
                        ? "border-emerald-700 bg-emerald-700"
                        : "border-gray-200 bg-white dark:border-dark-border dark:bg-dark-card"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        filtreType === filtre.valeur
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {filtre.libelle}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {recherchesRecentes.length > 4 && (
                <Pressable
                  accessibilityRole="button"
                  onPress={basculerHistoriqueComplet}
                  className="mt-3 flex-row items-center justify-center rounded-xl border border-gray-200 py-3 dark:border-dark-border"
                >
                  <Text className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {afficherHistoriqueComplet ? "Voir moins" : "Voir plus"}
                  </Text>

                  {afficherHistoriqueComplet ? (
                    <ChevronUp color="#047857" size={18} strokeWidth={2.2} />
                  ) : (
                    <ChevronDown color="#047857" size={18} strokeWidth={2.2} />
                  )}
                </Pressable>
              )}
            </View>
          )}
        </View>

        <ScrollView
          className="flex-1 bg-white dark:bg-dark-background"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 py-4">
            <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {searchQuery.trim()
                ? "Résultats"
                : "Recherchez une ligne ou un arrêt"}
            </Text>

            {rechercheEnCours ? (
              <View className="items-center py-8">
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Recherche en cours...
                </Text>
              </View>
            ) : resultatsFiltres.length > 0 ? (
              <View className="gap-2">
                {resultatsFiltres.map((item, index) => (
                  <Pressable
                    key={`${item.type}-${item.id}-${index}`}
                    android_ripple={{
                      color: modeSombre
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.12)",
                    }}

                    className="flex-row items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-dark-border dark:bg-dark-card"
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.9 : 1,
                      transform: [{ scale: pressed ? 0.99 : 1 }],
                      backgroundColor: pressed
                        ? modeSombre
                          ? "#26352F"
                          : "#ECFDF5"
                        : couleurCarte,
                      borderColor: pressed ? "#10B981" : couleurBordure,
                    })}
                    onPress={async () => {
                      try {
                        await ajouterRechercheRecente(item.titre);
                        await chargerRecherchesRecentes();

                        router.push({
                          pathname: "/detailsBus/[id]",
                          params: {
                            id: String(item.id),
                            type: item.type,
                          },
                        });
                      } catch (error) {
                        console.error(
                          "Erreur lors de l'ouverture du résultat :",
                          error,
                        );
                        Alert.alert(
                          "Erreur",
                          "Impossible d'ouvrir ce résultat.",
                        );
                      }
                    }}
                  >
                    <View
                      className={
                        item.type === "ligne"
                          ? "h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950"
                          : item.type === "parcours"
                            ? "h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950"
                            : "h-10 w-10 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-950"
                      }
                    >
                      {item.type === "ligne" ? (
                        <BusFront color="#047857" size={20} strokeWidth={2.2} />
                      ) : item.type === "parcours" ? (
                        <Route color="#D97706" size={20} strokeWidth={2.2} />
                      ) : (
                        <MapPin color="#0369A1" size={20} strokeWidth={2.2} />
                      )}
                    </View>

                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900 dark:text-white">
                        {item.titre}
                      </Text>

                      <Text className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                        {item.description}
                      </Text>
                    </View>

                    <ChevronRight color="#9CA3AF" size={20} strokeWidth={2.5} />
                  </Pressable>
                ))}
              </View>
            ) : searchQuery.trim() ? (
              <View className="items-center py-8">
                <Text className="text-base text-gray-500 dark:text-gray-300">
                  Aucun résultat trouvé
                </Text>

                <Text className="mt-2 text-sm text-gray-400">
                  Essayez avec un numéro de bus ou un nom d'arrêt.
                </Text>
              </View>
            ) : null}
          </View>

          {resultatsRecherche.length >= 20 && !voirTout && (
            <Pressable
              accessibilityRole="button"
              className="flex-row items-center justify-center rounded-lg"
              android_ripple={{
                color: modeSombre
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.12)",
              }}
              style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
              onPress={() => {
                setVoirTout(true);
                void effectuerRecherche(searchQuery, true);
              }}
            >
              <Text className="p-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                Voir tout
              </Text>

              <ChevronDown color={couleurTexte} size={18} strokeWidth={2.2} />
            </Pressable>
          )}

          {voirTout && resultatsRecherche.length > 20 && (
            <Pressable
              accessibilityRole="button"
              className="flex-row items-center justify-center rounded-lg"
              android_ripple={{
                color: modeSombre
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.12)",
              }}
              style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
              onPress={() => {
                setVoirTout(false);
                void effectuerRecherche(searchQuery, false);
              }}
            >
              <Text className="p-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                Réduire
              </Text>

              <ChevronUp color={couleurTexte} size={18} strokeWidth={2.2} />
            </Pressable>
          )}

          {recherchesRecentes.length > 0 && (
            <View className="mx-2 mt-6">
              <View className="mx-4 mb-3 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-gray-900 dark:text-white">
                  Recherches récentes
                </Text>

                <Pressable onPress={() => setModalEffacerVisible(true)}>
                  <Text className="text-sm font-medium text-emerald-600">
                    Effacer
                  </Text>
                </Pressable>
              </View>

              <View className="gap-2">
                {recherchesVisibles.map((recherche, index) => (
                  <Pressable
                    key={`${recherche}-${index}`}
                    onPress={() => {
                      void effectuerRecherche(recherche, false);
                    }}
                    className="flex-row items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-dark-card"
                    android_ripple={{
                      color: modeSombre
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.12)",
                    }}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.9 : 1,
                      backgroundColor: pressed
                        ? modeSombre
                          ? "#26352F"
                          : "#ECFDF5"
                        : couleurCarte,
                    })}
                  >
                    <ClockFading
                      color={couleurTexteSecondaire}
                      size={19}
                      strokeWidth={2}
                    />

                    <Text className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                      {recherche}
                    </Text>

                    <ChevronRight color="#9CA3AF" size={18} />
                  </Pressable>
                ))}
              </View>

              {recherchesRecentes.length > 4 && (
                <Pressable
                  accessibilityRole="button"
                  onPress={basculerHistoriqueComplet}
                  className="mt-3 flex-row items-center justify-center rounded-xl py-3"
                >
                  <Text className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {afficherHistoriqueComplet ? "Voir moins" : "Voir plus"}
                  </Text>

                  {afficherHistoriqueComplet ? (
                    <ChevronUp color="#047857" size={18} strokeWidth={2.2} />
                  ) : (
                    <ChevronDown color="#047857" size={18} strokeWidth={2.2} />
                  )}
                </Pressable>
              )}
            </View>
          )}
        </ScrollView>

        {modalSuppression}
      </SafeAreaView>
    </Animated.View>
  );
}
