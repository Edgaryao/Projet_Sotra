import { supabase } from "../lib/supabase";
import { getDatabase } from "./database";


// 1. Synchroniser les lignes
export async function syncLignes() {
  const { data, error } = await supabase.from("lignes").select("*");

  if (error) {
    console.error("❌ Erreur Supabase lignes :", error);
    throw error;
  }

  if (!data) {
    throw new Error("Aucune donnée reçue pour les lignes");
  }

  const db = await getDatabase();

  try {
  
    await db.withTransactionAsync(async () => {
      for (const ligne of data) {
        await db.runAsync(
          `INSERT OR REPLACE INTO lignes
           (id, numero, nom)
           VALUES (?, ?, ?)`,
          ligne.id,
          ligne.numero,
          ligne.nom,
        );
      }

      // Marquer l'étape comme terminée
      await db.runAsync(
        `UPDATE synchronisation
         SET lignes_ok = 1
         WHERE id = 1`,
      );
    });

    console.log("✅ Lignes synchronisées :", data.length);

    return data.length;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la synchronisation des lignes :",
      error,
    );

    throw error;
  }
}


// 2. Synchroniser les parcours
export async function syncParcours() {
  const { data, error } = await supabase.from("parcours").select("*");

  if (error) {
    console.error("❌ Erreur Supabase parcours :", error);
    throw error;
  }

  if (!data) {
    throw new Error("Aucun parcours reçu");
  }

  const db = await getDatabase();

  try {
    await db.withTransactionAsync(async () => {
      for (const parcours of data) {
        await db.runAsync(
          `INSERT OR REPLACE INTO parcours
           (id, ligne_id, nom, url_source)
           VALUES (?, ?, ?, ?)`,
          parcours.id,
          parcours.ligne_id,
          parcours.nom,
          parcours.url_source,
        );
      }

      await db.runAsync(
        `UPDATE synchronisation
         SET parcours_ok = 1
         WHERE id = 1`,
      );
    });

    console.log("✅ Parcours synchronisés :", data.length);

    return data.length;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la synchronisation des parcours :",
      error,
    );

    throw error;
  }
}


// 3. Synchroniser les arrêts
export async function syncArrets() {
  const { data, error } = await supabase.from("arrets").select("*");

  if (error) {
    console.error("❌ Erreur Supabase arrets :", error);
    throw error;
  }

  if (!data) {
    throw new Error("Aucun arrêt reçu");
  }

  const db = await getDatabase();

  try {
    await db.withTransactionAsync(async () => {
      for (const arret of data) {
        await db.runAsync(
          `INSERT OR REPLACE INTO arrets
           (id, nom, latitude, longitude)
           VALUES (?, ?, ?, ?)`,
          arret.id,
          arret.nom,
          arret.latitude,
          arret.longitude,
        );
      }

      // Marquer l'étape comme terminée
      await db.runAsync(
        `UPDATE synchronisation
         SET arrets_ok = 1
         WHERE id = 1`,
      );
    });

    console.log("✅ Arrêts synchronisés :", data.length);

    return data.length;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la synchronisation des arrêts :",
      error,
    );

    throw error;
  }
}


// 4. Synchroniser les relations parcours-arrêts
export async function syncParcoursArrets() {
  const { data, error } = await supabase
    .from("parcours_arrets")
    .select("*");

  if (error) {
    console.error(
      "❌ Erreur Supabase parcours_arrets :",
      error,
    );

    throw error;
  }

  if (!data) {
    throw new Error("Aucune relation parcours-arrêt reçue");
  }

  const db = await getDatabase();

  try {
    await db.withTransactionAsync(async () => {
      for (const parcoursArret of data) {
        await db.runAsync(
          `INSERT OR REPLACE INTO parcours_arrets
           (id, parcours_id, arret_id, ordre)
           VALUES (?, ?, ?, ?)`,
          parcoursArret.id,
          parcoursArret.parcours_id,
          parcoursArret.arret_id,
          parcoursArret.ordre,
        );
      }

      // Marquer l'étape comme terminée
      await db.runAsync(
        `UPDATE synchronisation
         SET parcours_arrets_ok = 1
         WHERE id = 1`,
      );
    });

    console.log(
      "✅ Parcours-arrets synchronisés :",
      data.length,
    );

    return data.length;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la synchronisation des parcours-arrets :",
      error,
    );

    throw error;
  }
}


// 5. Vérifier si la synchronisation complète est terminée
export async function synchronisationFaite() {
  const db = await getDatabase();

  const resultat = await db.getFirstAsync<{
    terminee: number;
  }>(
    `SELECT terminee
     FROM synchronisation
     WHERE id = 1`,
  );

  return resultat?.terminee === 1;
}


// 6. Récupérer l'état de chaque synchronisation
export async function getEtatSynchronisation() {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{
    lignes_ok: number;
    parcours_ok: number;
    arrets_ok: number;
    parcours_arrets_ok: number;
    terminee: number;
  }>(
    `SELECT
      lignes_ok,
      parcours_ok,
      arrets_ok,
      parcours_arrets_ok,
      terminee
     FROM synchronisation
     WHERE id = 1`,
  );

  // Aucun enregistrement
  if (!result) {
    await db.runAsync(
      `INSERT INTO synchronisation
       (
         id,
         lignes_ok,
         parcours_ok,
         arrets_ok,
         parcours_arrets_ok,
         terminee
       )
       VALUES (1, 0, 0, 0, 0, 0)`,
    );

    return {
      lignes_ok: 0,
      parcours_ok: 0,
      arrets_ok: 0,
      parcours_arrets_ok: 0,
      terminee: 0,
    };
  }

  return result;
}


// 7. Fonction générale pour marquer une étape
export async function marquerEtapeTerminee(
  etape: "lignes" | "parcours" | "arrets" | "parcours_arrets",
) {
  const db = await getDatabase();

  const existe = await db.getFirstAsync<{ id: number }>(
    `SELECT id
     FROM synchronisation
     WHERE id = 1`,
  );

  // Créer l'enregistrement s'il n'existe pas
  if (!existe) {
    await db.runAsync(
      `INSERT INTO synchronisation
       (
         id,
         lignes_ok,
         parcours_ok,
         arrets_ok,
         parcours_arrets_ok,
         terminee
       )
       VALUES (1, 0, 0, 0, 0, 0)`,
    );
  }

  await db.runAsync(
    `UPDATE synchronisation
     SET ${etape}_ok = 1
     WHERE id = 1`,
  );

  console.log(`✅ Étape "${etape}" terminée`);
}


// 8. Terminer complètement la synchronisation
export async function terminerSynchronisation() {
  const db = await getDatabase();

  await db.runAsync(
    `UPDATE synchronisation
     SET
       lignes_ok = 1,
       parcours_ok = 1,
       arrets_ok = 1,
       parcours_arrets_ok = 1,
       terminee = 1
     WHERE id = 1`,
  );

  console.log("🎉 Synchronisation complète terminée");
}

