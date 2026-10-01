// Script temporaire pour réinitialiser la base de données
// Exécutez avec : node resetDB.js

import { reinitialiserBase } from './src/database/synchornisation_supabase_sqlite.ts';

async function reset() {
  try {
    console.log("🔄 Réinitialisation de la base de données...");
    await reinitialiserBase();
    console.log("✅ Base de données réinitialisée avec succès !");
    console.log("Vous pouvez maintenant relancer l'application.");
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation:", error);
  }
}

reset();
