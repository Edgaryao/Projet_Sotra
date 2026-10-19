import { supabase } from "../lib/supabase";

export type ResultatRecherche = {
  id: number;
  type: "ligne" | "parcours" | "arret";
  titre: string;
  description: string;
  priorite: number;
};

type FiltreRecherche = "tous" | "ligne" | "parcours" | "arret";

export async function rechercherBus(
  recherche: string,
  limite?: number,
  filtre: FiltreRecherche = "tous",
): Promise<ResultatRecherche[]> {
  const texte = recherche.trim();

  if (!texte) {
    return [];
  }

  try {
    const terme = `%${texte}%`;
    const debut = `${texte}%`;
    const resultats: ResultatRecherche[] = [];

    if (filtre === "tous" || filtre === "ligne") {
      const { data, error } = await supabase
        .from("lignes")
        .select("id, numero, nom")
        .or(`numero.eq.${texte},numero.like.${debut},nom.ilike.${terme}`)
        .limit(limite ?? 100);

      if (error) throw error;

      for (const ligne of data ?? []) {
        const numero = String(ligne.numero ?? "");

        resultats.push({
          id: Number(ligne.id),
          type: "ligne",
          titre: `Bus ${numero}`,
          description: ligne.nom ?? "",
          priorite: numero === texte ? 1 : numero.startsWith(texte) ? 2 : 3,
        });
      }

      // Recherche des lignes par nom de parcours
      const { data: parcours, error: erreurParcours } = await supabase
        .from("parcours")
        .select("id, ligne_id, nom, lignes(numero)")
        .ilike("nom", terme)
        .limit(limite ?? 100);

      if (erreurParcours) throw erreurParcours;

      for (const parcoursItem of parcours ?? []) {
        const ligneLiee = Array.isArray(parcoursItem.lignes)
          ? parcoursItem.lignes[0]
          : parcoursItem.lignes;

        const existe = resultats.some(
          (item) =>
            item.type === "ligne" && item.id === Number(parcoursItem.ligne_id),
        );

        if (!existe && ligneLiee) {
          resultats.push({
            id: Number(parcoursItem.ligne_id),
            type: "ligne",
            titre: `Bus ${ligneLiee.numero}`,
            description: parcoursItem.nom ?? "",
            priorite: 3,
          });
        }
      }
    }

    if (filtre === "tous" || filtre === "parcours") {
      const { data, error } = await supabase
        .from("parcours")
        .select("id, nom, lignes(numero)")
        .ilike("nom", terme)
        .limit(limite ?? 100);

      if (error) throw error;

      for (const parcours of data ?? []) {
        const ligne = Array.isArray(parcours.lignes)
          ? parcours.lignes[0]
          : parcours.lignes;

        resultats.push({
          id: Number(parcours.id),
          type: "parcours",
          titre: parcours.nom ?? "",
          description: ligne ? `Ligne ${ligne.numero}` : "Parcours de bus",
          priorite: (parcours.nom ?? "")
            .toLowerCase()
            .startsWith(texte.toLowerCase())
            ? 2
            : 4,
        });
      }
    }

    if (filtre === "tous" || filtre === "arret") {
      const { data, error } = await supabase
        .from("arrets")
        .select("id, nom")
        .ilike("nom", terme)
        .limit(limite ?? 100);

      if (error) throw error;

      for (const arret of data ?? []) {
        resultats.push({
          id: Number(arret.id),
          type: "arret",
          titre: arret.nom ?? "",
          description: "Arrêt de bus",
          priorite: (arret.nom ?? "")
            .toLowerCase()
            .startsWith(texte.toLowerCase())
            ? 2
            : 4,
        });
      }
    }

    return resultats.sort((a, b) => a.priorite - b.priorite).slice(0, limite);
  } catch (error) {
    console.error("Erreur dans la recherche Supabase :", error);
    return [];
  }
}
