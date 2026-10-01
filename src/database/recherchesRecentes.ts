import AsyncStorage from "@react-native-async-storage/async-storage";

const CLE_RECHERCHES_RECENTES = "@sotra_recherches_recentes";

const MAX_RECHERCHES = 5;

// Récupérer les recherches récentes
export async function recupererRecherchesRecentes(): Promise<string[]> {
  try {
    const donnees = await AsyncStorage.getItem(CLE_RECHERCHES_RECENTES);

    if (!donnees) {
      return [];
    }

    return JSON.parse(donnees);
  } catch (error) {
    console.error("❌ Erreur récupération recherches récentes :", error);

    return [];
  }
}

// Ajouter une recherche récente
export async function ajouterRechercheRecente(
  recherche: string,
): Promise<void> {
  try {
    const texte = recherche.trim();

    if (!texte) {
      return;
    }

    const anciennesRecherches = await recupererRecherchesRecentes();

    // Supprimer le doublon
    const recherchesSansDoublon = anciennesRecherches.filter(
      (item) => item.toLowerCase() !== texte.toLowerCase(),
    );

    // Mettre la nouvelle recherche au début
    const nouvellesRecherches = [texte, ...recherchesSansDoublon];

    // Garder seulement les 5 dernières
    const recherchesLimitees = nouvellesRecherches.slice(0, MAX_RECHERCHES);

    await AsyncStorage.setItem(
      CLE_RECHERCHES_RECENTES,
      JSON.stringify(recherchesLimitees),
    );
  } catch (error) {
    console.error("❌ Erreur sauvegarde recherche récente :", error);
  }
}

// Supprimer toutes les recherches récentes
export async function supprimerRecherchesRecentes(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CLE_RECHERCHES_RECENTES);
  } catch (error) {
    console.error("❌ Erreur suppression recherches récentes :", error);
  }
}
