
import { getDatabase } from "./database";


// TYPE DES RÉSULTATS


export type ResultatRecherche = {
  id: number;
  type: "ligne" | "parcours" | "arret";
  titre: string;
  description: string;
  priorite: number;
};


// RECHERCHE DANS SQLITE


export async function rechercherBus(
  recherche: string,
  limite?: number,
  filtre: "tous" | "ligne" | "parcours" | "arret" = "tous",
): Promise<ResultatRecherche[]> {
  try {
    const db = await getDatabase();


    // Nettoyer la recherche


    const texte = recherche.trim();

    // Si la recherche est vide
    if (!texte) {
      return [];
    }

    // Recherche contenant le texte
    // Exemple : Abobo -> %Abobo%
    const terme = `%${texte}%`;

    // Recherche commençant par le texte
    // Exemple : 76 -> 76%
    const debut = `${texte}%`;

    // =================================================
    // LISTE DES REQUÊTES
    // =================================================

    const requetes: string[] = [];

    // Paramètres utilisés par SQLite
    const parametres: any[] = [];

    // =================================================
    // 1️⃣ RECHERCHE DES LIGNES
    // =================================================

    if (filtre === "tous" || filtre === "ligne") {
      requetes.push(`
        SELECT
          l.id AS id,

          'ligne' AS type,

          'Bus ' || l.numero AS titre,

          l.nom AS description,

          CASE

            -- Numéro exactement identique
            WHEN l.numero = ? THEN 1

            -- Numéro commence par la recherche
            WHEN l.numero LIKE ? THEN 2

            -- Nom de la ligne contient la recherche
            WHEN l.nom LIKE ? THEN 3

            -- Un arrêt de cette ligne contient la recherche
            WHEN EXISTS (
              SELECT 1

              FROM parcours p

              JOIN parcours_arrets pa
                ON pa.parcours_id = p.id

              JOIN arrets a
                ON a.id = pa.arret_id

              WHERE p.ligne_id = l.id

                AND a.nom LIKE ?
            ) THEN 3

            -- Un parcours de cette ligne contient la recherche
            WHEN EXISTS (
              SELECT 1

              FROM parcours p

              WHERE p.ligne_id = l.id

                AND p.nom LIKE ?
            ) THEN 3

            ELSE 4

          END AS priorite

        FROM lignes l

        WHERE

          -- Recherche par numéro
          l.numero LIKE ?

          OR

          -- Recherche par nom de ligne
          l.nom LIKE ?

          OR

          -- Recherche dans les parcours
          EXISTS (
            SELECT 1

            FROM parcours p

            WHERE p.ligne_id = l.id

              AND p.nom LIKE ?
          )

          OR

          -- Recherche dans les arrêts
          EXISTS (
            SELECT 1

            FROM parcours p

            JOIN parcours_arrets pa
              ON pa.parcours_id = p.id

            JOIN arrets a
              ON a.id = pa.arret_id

            WHERE p.ligne_id = l.id

              AND a.nom LIKE ?
          )
      `);

  
      // PARAMÈTRES LIGNES
  

      parametres.push(

        // CASE - numéro exact
        texte,

        // CASE - numéro commence par
        debut,

        // CASE - nom de ligne
        terme,

        // CASE - arrêt
        terme,

        // CASE - parcours
        terme,

        // WHERE - numéro
        terme,

        // WHERE - nom
        terme,

        // WHERE - parcours
        terme,

        // WHERE - arrêt
        terme,
      );
    }

    // =================================================
    // 2️⃣ RECHERCHE DES PARCOURS
    // =================================================

    if (filtre === "tous" || filtre === "parcours") {
      requetes.push(`
        SELECT

          p.id AS id,

          'parcours' AS type,

          p.nom AS titre,

          'Ligne ' || l.numero AS description,

          CASE

            -- Le nom du parcours commence par la recherche
            WHEN p.nom LIKE ? THEN 2

            ELSE 4

          END AS priorite

        FROM parcours p

        JOIN lignes l
          ON l.id = p.ligne_id

        WHERE p.nom LIKE ?
      `);

  
      // PARAMÈTRES PARCOURS
  

      parametres.push(

        // CASE
        terme,

        // WHERE
        terme,
      );
    }

    // =================================================
    // 3️⃣ RECHERCHE DES ARRÊTS
    // =================================================

    if (filtre === "tous" || filtre === "arret") {
      requetes.push(`
        SELECT

          a.id AS id,

          'arret' AS type,

          a.nom AS titre,

          'Arrêt de bus' AS description,

          CASE

            -- Nom de l'arrêt commence par la recherche
            WHEN a.nom LIKE ? THEN 2

            ELSE 4

          END AS priorite

        FROM arrets a

        WHERE a.nom LIKE ?
      `);

  
      // PARAMÈTRES ARRÊTS
  

      parametres.push(

        // CASE
        terme,

        // WHERE
        terme,
      );
    }

    // =================================================
    // VÉRIFICATION
    // =================================================

    if (requetes.length === 0) {
      return [];
    }

    // =================================================
    // ASSEMBLER LES REQUÊTES
    // =================================================

    let sql = requetes.join(`
      UNION ALL
    `);

    // =================================================
    // TRI PAR PRIORITÉ
    // =================================================

    sql += `
      ORDER BY priorite ASC
    `;

    // =================================================
    // LIMITE
    // =================================================

    if (limite !== undefined) {
      sql += `
        LIMIT ?
      `;

      parametres.push(limite);
    }

    // =================================================
    // DEBUG
    // =================================================

    console.log("Recherche :", texte);

    console.log("Filtre :", filtre);

    console.log("Limite :", limite);

    // =================================================
    // EXÉCUTER LA REQUÊTE
    // =================================================

    const resultats =
      await db.getAllAsync<ResultatRecherche>(
        sql,
        parametres,
      );

    // =================================================
    // RETOURNER LES RÉSULTATS
    // =================================================

    return resultats;

  } catch (error) {

    console.error(
      "❌ Erreur dans rechercherBus :",
      error,
    );

    return [];
  }
}

