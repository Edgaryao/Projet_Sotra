const CLE_RECHERCHES_RECENTES = "@sotra_recherches_recentes";

export async function recupererRecherchesRecentes(): Promise<string[]> {
  try {
    const donnees = localStorage.getItem(CLE_RECHERCHES_RECENTES);

    if (!donnees) return [];

    const recherches: unknown = JSON.parse(donnees);

    return Array.isArray(recherches)
      ? recherches.filter((item): item is string => typeof item === "string")
      : [];
  } catch (error) {
    console.error("Erreur récupération recherches récentes :", error);
    return [];
  }
}

export async function ajouterRechercheRecente(
  recherche: string,
): Promise<void> {
  try {
    const texte = recherche.trim();

    if (!texte) return;

    const anciennesRecherches = await recupererRecherchesRecentes();

    const recherchesSansDoublon = anciennesRecherches.filter(
      (item) => item.toLowerCase() !== texte.toLowerCase(),
    );

    const nouvellesRecherches = [texte, ...recherchesSansDoublon].slice(0, 20);

    localStorage.setItem(
      CLE_RECHERCHES_RECENTES,
      JSON.stringify(nouvellesRecherches),
    );
  } catch (error) {
    console.error("Erreur sauvegarde recherche récente :", error);
  }
}

export async function supprimerRecherchesRecentes(): Promise<void> {
  try {
    localStorage.removeItem(CLE_RECHERCHES_RECENTES);
  } catch (error) {
    console.error("Erreur suppression recherches récentes :", error);
  }
}
