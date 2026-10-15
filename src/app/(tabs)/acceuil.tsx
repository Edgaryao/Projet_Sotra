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
  Sparkles,
  Sun,
  X,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
  Alert,
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
import { rechercherBus, ResultatRecherche } from "../../database/recherche";
import {
  ajouterRechercheRecente,
  recupererRecherchesRecentes,
  supprimerRecherchesRecentes,
} from "../../database/recherchesRecentes";
import { reinitialiserBase } from "../../database/resetDatabase";

type FiltreType = "tous" | "ligne" | "arret" | "parcours";
const filtres: { valeur: FiltreType; libelle: string }[] = [
  { valeur: "tous", libelle: "Tous" },
  { valeur: "ligne", libelle: "Bus" },
  { valeur: "arret", libelle: "Arrêt" },
  { valeur: "parcours", libelle: "Parcours" },
];

export default function acceuil() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  useEffect(() => {
    chargerRecherchesRecentes();
    {
      /*charge les recherches récentes*/
    }
  }, []);

  const chargerRecherchesRecentes = async () => {
    {
      /* fonction qui charge les recherches récentes*/
    }
    const recherches = await recupererRecherchesRecentes();

    setRecherchesRecentes(recherches);
  };

  const [modalEffacerVisible, setModalEffacerVisible] = useState(false);
  const [voirArretsProche, setVoirArretsProche] = useState(false);
  const [changeTheme, setChangeTheme] = useState(false);
  const [trouverTrajet, setTrouverTrajet] = useState(false);
  const [voirCarteArrets, setVoirCarteArrets] = useState(false);
  const [voirTout, setVoirTout] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
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

  const handleSearchFocus = () => {
    setIsSearchMode(true);
  };

  const handleSearchClose = () => {
    setIsSearchMode(false);
    setSearchQuery("");
    Keyboard.dismiss();
  };
  const handleSearchChange = (texte: string) => {
    setVoirTout(false);
    effectuerRecherche(texte, false);
  };
  const effectuerRecherche = async (texte: string, afficherTout = false) => {
    setSearchQuery(texte);

    if (!texte.trim()) {
      setResultatsRecherche([]);
      return;
    }

    try {
      setRechercheEnCours(true);

      const resultats = await rechercherBus(
        texte,
        afficherTout ? undefined : 20,
        filtreType,
      );
      if (resultats.length > 0) {
      }
      setResultatsRecherche(resultats);
      console.log("🔎 Résultats avant affichage :", resultatsRecherche);
    } catch (error) {
      console.error("❌ Erreur recherche SQLite :", error);
      setResultatsRecherche([]);
    } finally {
      setRechercheEnCours(false);
    }
  };

  // Fonction pour réinitialiser la base de données (TEST uniquement)
  const resetDatabase = async () => {
    Alert.alert(
      "Réinitialiser la base ?",
      "Cela supprimera toutes les données. Vous devrez re-synchroniser.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: async () => {
            try {
              await reinitialiserBase();
              console.log("✅ Base de données vidée avec succès");
              Alert.alert(
                "Succès",
                "Base de données réinitialisée ! Fermez et relancez l'application.",
              );
            } catch (error) {
              console.error("❌ Erreur lors de la réinitialisation:", error);
              Alert.alert("Erreur", "Impossible de réinitialiser la base");
            }
          },
        },
      ],
    );
  };

  // Vue normale (accueil)
  if (!isSearchMode) {
    return (
      <ImageBackground
        source={
          colorScheme === "light"
            ? require("../../../assets/images/background.png")
            : require("../../../assets/images/bg-dark.png")
        }
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1 px-5 pt-3">
          {/* Header with logo */}
          <View className="mb-8 flex-row items-center gap-3 justify-between">
            <View className="flex-1">
              <Text className="text-xl font-extrabold dark:text-white text-gray-900 drop-shadow-lg">
                SOTRA GO
              </Text>
              <Text className="text-xs font-semibold  dark:text-white tracking-wider text-gray-700">
                ABIDJAN
              </Text>
            </View>

            <Pressable
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
              {changeTheme ? (
                <Sun color={colorScheme === "light" ? "black" : "white"} />
              ) : (
                <Moon color={colorScheme === "light" ? "black" : "white"} />
              )}
            </Pressable>
          </View>

          {/* Main title section */}
          <View className="mb-6">
            <Text className="text-4xl dark:text-white font-extrabold leading-tight text-gray-900 drop-shadow-lg">
              Où souhaitez-vous aller ?
            </Text>
            <Text className="mt-3 text-base leading-6 dark:text-white text-gray-700">
              Trouvez une ligne ou un arrêt pour votre trajet.
            </Text>
          </View>

          {/* Search bar with shadow */}
          <Pressable onPress={handleSearchFocus}>
            <View className="h-16 flex-row dark:bg-dark-background dark:border-dark-border items-center gap-3 rounded-2xl bg-white px-5 shadow-2xl shadow-black/30">
              <Search color="#10B981" size={22} strokeWidth={2.5} />
              <Text className="flex-1 text-base font-medium text-gray-400">
                Numero de bus, ligne, arrêt....
              </Text>
            </View>
          </Pressable>

          {/* Location button */}
          <Pressable
            accessibilityRole="button"
            className="mt-4 min-h-14 flex-row items-center gap-3 rounded-2xl bg-emerald-600 px-5 shadow-xl shadow-emerald-900/40"
            style={{
              opacity: voirArretsProche ? 0.85 : 1,
              transform: [{ scale: voirArretsProche ? 0.98 : 1 }],
            }}
            onPressIn={() => setVoirArretsProche(true)}
            onPressOut={() => setVoirArretsProche(false)}
            onPress={() => {
              router.push("/(tabs)/carte");
            }}
          >
            <LocateFixed color="white" size={22} strokeWidth={2.5} />
            <Text className="flex-1 text-sm font-bold text-white">
              Trouver les arrêts autour de moi
            </Text>
            <ChevronRight color="white" size={22} strokeWidth={2.5} />
          </Pressable>
          {/* <Pressable
            onPress={resetDatabase}
            className="rounded-lg border-2 border-red-500 bg-red-500/10 px-4 py-2"
          >
            <Text className="text-center text-sm font-bold text-red-500">
              🔧 RESET DB (TEST)
            </Text>
          </Pressable> */}

          {/* Scrollable content */}
          <View className="mt-8 flex-1">
            {/* Quick access section */}
            <View>
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-2xl font-extrabold text-gray-900">
                  Accès rapide
                </Text>
              </View>
              <View className="flex-row justify-between gap-4">
                <Pressable
                  accessibilityRole="button"
                  className="min-h-44 flex-1 overflow-hidden rounded-3xl shadow-xl shadow-black/10"

                  style={{
                    opacity: trouverTrajet ? 0.9 : 1,
                    transform: [{ scale: trouverTrajet ? 0.97 : 1 }],
                  }}

                  onPress={() => {
                    router.push("/(tabs)/carte");
                  }}
                  onPressIn={() => setTrouverTrajet(true)}
                  onPressOut={() => setTrouverTrajet(false)}
                >
                  <ImageBackground
                    source={require("../../../assets/images/trajet.jpg")}
                    className="flex-1 justify-between p-5"
                    resizeMode="cover"
                  >
                    <View className="absolute inset-0 bg-black/40" />
                    <View className="flex-row items-center justify-between">
                      <View className="h-14 w-14 items-center justify-center rounded-2xl" />
                      <View className="h-8 w-8 items-center justify-center rounded-full bg-white/90">
                        <Route color="#6B7280" size={18} strokeWidth={2.5} />
                      </View>
                    </View>
                    <View className="mt-6">
                      <Text className="text-xl font-extrabold text-white drop-shadow-lg">
                        Trouver un trajet
                      </Text>
                      <Text className="mt-1.5 text-xs leading-5 text-white/95 drop-shadow-md">
                        Départ ---{">"} Destination
                      </Text>
                    </View>
                  </ImageBackground>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  className="min-h-44 flex-1 overflow-hidden rounded-3xl shadow-xl shadow-black/10"
                  style={{
                    opacity: voirCarteArrets ? 0.9 : 1,
                    transform: [{ scale: voirCarteArrets ? 0.97 : 1 }],
                  }}

                  onPress={() => {
                    router.push("/(tabs)/carte");
                  }}
                  onPressIn={() => setVoirCarteArrets(true)}
                  onPressOut={() => setVoirCarteArrets(false)}
                >
                  <ImageBackground
                    source={require("../../../assets/images/carte.png")}
                    className="flex-1 justify-between p-5"
                    resizeMode="cover"
                  >
                    <View className="absolute inset-0 bg-black/40" />
                    <View className="flex-row items-center justify-between">
                      <View className="h-14 w-14 items-center justify-center rounded-2xl"></View>
                      <View className="h-8 w-8 items-center justify-center rounded-full bg-white/90">
                        <Route color="#6B7280" size={18} strokeWidth={2.5} />
                      </View>
                    </View>
                    <View className="mt-6">
                      <Text className="text-xl font-extrabold text-white drop-shadow-lg">
                        Carte des arrêts
                      </Text>
                      <Text className="mt-1.5 text-xs leading-5 text-white/95 drop-shadow-md">
                        Explorer les alentours
                      </Text>
                    </View>
                  </ImageBackground>
                </Pressable>
              </View>
            </View>

            {/* Recent section */}
            {recherchesRecentes.length > 0 && (
              <View className="mt-6">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-gray-900">
                    Recherches récentes
                  </Text>

                  <Pressable
                    onPress={() => {
                      setModalEffacerVisible(true);
                    }}
                  >
                    <Text className="text-sm font-medium text-emerald-600">
                      Effacer
                    </Text>
                  </Pressable>
                </View>

                <View className="gap-2">
                  {recherchesRecentes.map((recherche, index) => (
                    <Pressable
                      key={`${recherche}-${index}`}
                      onPress={() => {
                        effectuerRecherche(recherche, false);
                        setIsSearchMode(true);
                      }}
                      className="flex-row items-center gap-3 rounded-xl bg-gray-50 p-4"
                    >
                      <ClockFading color="#6B7280" size={19} strokeWidth={2} />

                      <Text className="flex-1 text-sm font-medium text-gray-700">
                        {recherche}
                      </Text>

                      <ChevronRight color="#D1D5DB" size={18} />
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
          <Modal
            visible={modalEffacerVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalEffacerVisible(false)}
          >
            <View className="flex-1 items-center justify-center bg-black/50 px-6">
              <View className="w-full rounded-3xl bg-white p-6">
                {/* Titre */}
                <Text className="text-xl font-bold text-gray-900">
                  Effacer les recherches ?
                </Text>

                {/* Description */}
                <Text className="mt-2 text-sm leading-5 text-gray-500">
                  Voulez-vous vraiment supprimer toutes vos recherches récentes
                  ?
                </Text>

                {/* Boutons */}
                <View className="mt-6 flex-row gap-3">
                  <Pressable
                    onPress={() => setModalEffacerVisible(false)}
                    className="flex-1 items-center rounded-xl bg-gray-100 py-3"
                  >
                    <Text className="font-semibold text-gray-700">Annuler</Text>
                  </Pressable>

                  <Pressable
                    onPress={async () => {
                      await supprimerRecherchesRecentes();

                      setRecherchesRecentes([]);
                      setModalEffacerVisible(false);
                    }}
                    className="flex-1 items-center rounded-xl bg-red-500 py-3"
                  >
                    <Text className="font-semibold text-white">Effacer</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // Vue mode recherche

  return (
    <Animated.View entering={FadeIn.duration(400)} className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        {/* Barre de recherche en haut */}
        <View className="border-b border-gray-200 bg-white px-4 py-3">
          <View className="flex-row items-center gap-3">
            {/* Bouton retour */}
            <Pressable
              onPress={handleSearchClose}
              className="h-10 w-10 items-center justify-center"
            >
              <X color="#374151" size={24} strokeWidth={2.5} />
            </Pressable>

            {/* Input de recherche */}
            <View className="flex-1 flex-row items-center gap-3 rounded-xl bg-gray-100 px-4 py-3">
              <Search color="#10B981" size={20} strokeWidth={2.5} />
              <TextInput
                autoFocus
                value={searchQuery}
                onChangeText={handleSearchChange}
                className="flex-1 text-base font-medium text-gray-900"
                placeholder="Rechercher une ligne de bus, arrêts..."
                placeholderTextColor="#9CA3AF"
              />
              {searchQuery.length > 0 && (
                <Pressable
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
                accessibilityLabel="Afficher les filtres de recherche"
                onPress={() => setFiltresVisibles((visibles) => !visibles)}
                className={`h-9 w-9 items-center justify-center rounded-lg ${filtreType !== "tous" ? "bg-emerald-100" : "bg-white"}`}
              >
                <SlidersHorizontal
                  color={filtreType !== "tous" ? "#047857" : "#6B7280"}
                  size={20}
                  strokeWidth={2.2}
                />
              </Pressable>
            </View>
          </View>
          {filtresVisibles && (
            <View className="mt-3 border-t border-gray-100 pt-3">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-gray-700">
                  Filtrer par
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fermer les filtres"
                  onPress={() => setFiltresVisibles(false)}
                  className="px-2 py-1"
                >
                  <Text className="text-sm font-medium text-gray-500">
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
                    onPress={() => setFiltreType(filtre.valeur)}
                    className={`flex-1 items-center rounded-lg border px-2 py-2 ${filtreType === filtre.valeur ? "border-emerald-700 bg-emerald-700" : "border-gray-200 bg-white"}`}
                  >
                    <Text
                      className={`text-sm font-semibold ${filtreType === filtre.valeur ? "text-white" : "text-gray-700"}`}
                    >
                      {filtre.libelle}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Contenu de la recherche */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Assistant IA en haut */}
          <View className="border-b border-gray-100 bg-emerald-50 px-4 py-4">
            <Pressable
              onPress={() => {
                router.push("/(tabs)/Ia");
              }}
              className="flex-row items-center gap-4 rounded-2xl bg-white p-4 shadow-sm shadow-emerald-900/10"
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-amber-400">
                <Sparkles color="#1F2937" size={22} strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900">
                  Demander à l'IA
                </Text>
                <Text className="mt-0.5 text-sm text-gray-600">
                  Recherche complexe ou question sur les trajets
                </Text>
              </View>
              <ChevronRight color="#9CA3AF" size={22} strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* Résultats de recherche */}
          <View className="px-4 py-4">
            <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              {searchQuery.trim()
                ? "Résultats"
                : "Recherchez une ligne ou un arrêt"}
            </Text>

            {rechercheEnCours ? (
              <View className="items-center py-8">
                <Text className="text-sm text-gray-500">
                  Recherche en cours...
                </Text>
              </View>
            ) : resultatsFiltres.length > 0 ? (
              <View className="gap-2">
                {resultatsFiltres.map((item, index) => (
                  <Pressable
                    key={`${item.type}-${item.id}-${index}`}
                    className="flex-row items-center gap-4 rounded-xl bg-gray-50 p-4"
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                    })}
                    onPress={async () => {
                      console.log("Résultat sélectionné :", item);

                      await ajouterRechercheRecente(item.titre);
                      await chargerRecherchesRecentes();

                      router.push({
                        pathname: "/detailsBus/[id]",
                        params: {
                          id: String(item.id),
                          type: item.type,
                        },
                      });
                    }}
                  >
                    {/* Icône selon le type de résultat */}
                    <View
                      className={
                        item.type === "ligne"
                          ? "h-10 w-10 items-center justify-center rounded-lg bg-emerald-100"
                          : item.type === "parcours"
                            ? "h-10 w-10 items-center justify-center rounded-lg bg-amber-100"
                            : "h-10 w-10 items-center justify-center rounded-lg bg-sky-100"
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

                    {/* Texte */}
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900">
                        {item.titre}
                      </Text>

                      <Text className="mt-0.5 text-xs text-gray-600">
                        {item.description}
                      </Text>
                    </View>

                    {/* Flèche */}
                    <ChevronRight color="#D1D5DB" size={20} strokeWidth={2.5} />
                  </Pressable>
                ))}
              </View>
            ) : searchQuery.trim() ? (
              <View className="items-center py-8">
                <Text className="text-base text-gray-500">
                  Aucun résultat trouvé
                </Text>

                <Text className="mt-2 text-sm text-gray-400">
                  Essayez avec un numéro de bus ou un nom d'arrêt
                </Text>
              </View>
            ) : null}
          </View>
          {resultatsRecherche.length >= 20 && !voirTout && (
            <Pressable
              className=" flex-row  justify-center items-center"
              onPress={() => {
                setVoirTout(true);
                effectuerRecherche(searchQuery, true);
              }}
            >
              <Text className="text-sm font-semibold p-4">Voir tout</Text>
              <ChevronDown size={18} strokeWidth={2.2} />
            </Pressable>
          )}
          {voirTout && resultatsRecherche.length > 20 && (
            <Pressable
              className=" flex-row  justify-center items-center"
              onPress={() => {
                setVoirTout(false);
                effectuerRecherche(searchQuery, false);
              }}
            >
              <Text className="text-sm font-semibold p-4">Réduire</Text>
              <ChevronUp size={18} strokeWidth={2.2} />
            </Pressable>
          )}
          {/* Recherches récentes en mode recherche */}
          {recherchesRecentes.length > 0 && (
            <View className="mt-6 mx-2">
              <View className="mb-3 flex-row items-center justify-between mx-4">
                <Text className="text-base font-semibold text-gray-900">
                  Recherches récentes
                </Text>

                <Pressable
                  onPress={() => {
                    setModalEffacerVisible(true);
                  }}
                >
                  <Text className="text-sm font-medium text-emerald-600">
                    Effacer
                  </Text>
                </Pressable>
              </View>

              <View className="gap-2">
                {recherchesRecentes.map((recherche, index) => (
                  <Pressable
                    key={`${recherche}-${index}`}
                    onPress={() => {
                      effectuerRecherche(recherche, false);
                    }}
                    className="flex-row items-center gap-3 rounded-xl bg-gray-50 p-4"
                  >
                    <ClockFading color="#6B7280" size={19} strokeWidth={2} />

                    <Text className="flex-1 text-sm font-medium text-gray-700">
                      {recherche}
                    </Text>

                    <ChevronRight color="#D1D5DB" size={18} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
        <Modal
          visible={modalEffacerVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalEffacerVisible(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/50 px-6">
            <View className="w-full rounded-3xl bg-white p-6">
              {/* Titre */}
              <Text className="text-xl font-bold text-gray-900">
                Effacer les recherches ?
              </Text>

              {/* Description */}
              <Text className="mt-2 text-sm leading-5 text-gray-500">
                Voulez-vous vraiment supprimer toutes vos recherches récentes ?
              </Text>

              {/* Boutons */}
              <View className="mt-6 flex-row gap-3">
                <Pressable
                  onPress={() => setModalEffacerVisible(false)}
                  className="flex-1 items-center rounded-xl bg-gray-100 py-3"
                >
                  <Text className="font-semibold text-gray-700">Annuler</Text>
                </Pressable>

                <Pressable
                  onPress={async () => {
                    await supprimerRecherchesRecentes();

                    setRecherchesRecentes([]);
                    setModalEffacerVisible(false);
                  }}
                  className="flex-1 items-center rounded-xl bg-red-500 py-3"
                >
                  <Text className="font-semibold text-white">Effacer</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Animated.View>
  );
}
