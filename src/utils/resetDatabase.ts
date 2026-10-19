import { reinitialiserBase } from "../database/synchornisation_supabase_sqlite.web";

/**
 * Fonction utilitaire pour réinitialiser la base de données
 * À utiliser uniquement en développement
 */
export async function resetDatabaseForDev() {
  try {
    console.log("🔄 Réinitialisation de la base de données...");
    await reinitialiserBase();
    console.log("✅ Base de données réinitialisée avec succès !");
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation:", error);
    return { success: false, error };
  }
}

// Pour l'appeler depuis la console :
// import { resetDatabaseForDev } from './src/utils/resetDatabase';
// await resetDatabaseForDev();
