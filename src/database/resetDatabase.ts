import { getDatabase } from "./database";

export async function reinitialiserBase() {
  try {
    const db = await getDatabase();

    // Supprimer les données dans l'ordre
    // pour respecter les clés étrangères
    await db.execAsync(`
      DELETE FROM parcours_arrets;
      DELETE FROM arrets;
      DELETE FROM parcours;
      DELETE FROM lignes;
      DELETE FROM synchronisation;
    `);

    console.log("🗑️ Base SQLite réinitialisée avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation :", error);
    throw error;
  }
}
