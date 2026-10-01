import { getDatabase } from "./database";

// Type des résultats qui seront affichés dans l'input
export type ResultatRecherche = {
  id: number;
  type: "ligne" | "parcours" | "arret";
  titre: string;
  description: string;
  priorite: number;
};

// Rechercher dans la base SQLite locale
export async function rechercherBus(
  recherche: string,
  limite?: number,
): Promise<ResultatRecherche[]> {
  try {
    const db = await getDatabase();

    const texte = recherche.trim();

    if (!texte) {
      return [];
    }

    const terme = `%${texte}%`;
    const debut = `${texte}%`;

    let sql = `
      SELECT
        l.id AS id,
        'ligne' AS type,
        'Bus ' || l.numero AS titre,
        l.nom AS description,

        CASE
          WHEN l.numero = ? THEN 1
          WHEN l.numero LIKE ? THEN 2
          WHEN l.nom LIKE ? THEN 3
          ELSE 4
        END AS priorite

      FROM lignes l

      WHERE l.numero LIKE ?
         OR l.nom LIKE ?

      UNION ALL

      SELECT
        p.id AS id,
        'parcours' AS type,
        p.nom AS titre,
        'Ligne ' || l.numero AS description,

        CASE
          WHEN p.nom LIKE ? THEN 3
          ELSE 4
        END AS priorite

      FROM parcours p

      JOIN lignes l ON l.id = p.ligne_id

      WHERE p.nom LIKE ?

      UNION ALL

      SELECT
        a.id AS id,
        'arret' AS type,
        a.nom AS titre,
        'Arrêt de bus' AS description,

        CASE
          WHEN a.nom LIKE ? THEN 3
          ELSE 4
        END AS priorite

      FROM arrets a

      JOIN parcours_arrets pa ON pa.arret_id = a.id
      JOIN parcours p ON p.id = pa.parcours_id
      JOIN lignes l ON l.id = p.ligne_id

      WHERE a.nom LIKE ?

      ORDER BY priorite ASC
    `;

    // Si une limite est donnée, on l'ajoute
    if (limite !== undefined) {
      sql += ` LIMIT ?`;
    }

    const parametres: any[] = [
      // Recherche ligne exacte
      texte,

      // Ligne qui commence par le texte
      debut,

      // Nom de ligne contenant le texte
      terme,

      // WHERE l.numero
      terme,

      // WHERE l.nom
      terme,

      // Parcours
      terme,

      // WHERE p.nom
      terme,

      // Arrêt
      terme,

      // WHERE a.nom
      terme,
    ];

    // Ajouter la limite seulement si elle existe
    if (limite !== undefined) {
      parametres.push(limite);
    }

    const resultats = await db.getAllAsync<ResultatRecherche>(sql, parametres);

    return resultats;
  } catch (error) {
    console.error("❌ Erreur dans rechercherBus:", error);
    return [];
  }
}
