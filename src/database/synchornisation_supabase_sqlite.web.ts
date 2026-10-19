export async function synchronisationFaite(): Promise<boolean> {
  return true;
}

export async function getEtatSynchronisation() {
  return {
    lignes_ok: 1,
    parcours_ok: 1,
    arrets_ok: 1,
    parcours_arrets_ok: 1,
    terminee: 1,
  };
}

export async function syncLignes(): Promise<number> {
  throw new Error("La synchronisation SQLite est réservée à Android.");
}

export async function syncParcours(): Promise<number> {
  throw new Error("La synchronisation SQLite est réservée à Android.");
}

export async function syncArrets(): Promise<number> {
  throw new Error("La synchronisation SQLite est réservée à Android.");
}

export async function syncParcoursArrets(): Promise<number> {
  throw new Error("La synchronisation SQLite est réservée à Android.");
}

export async function marquerEtapeTerminee(): Promise<void> {
  throw new Error("La synchronisation SQLite est réservée à Android.");
}

export async function terminerSynchronisation(): Promise<void> {
  throw new Error("La synchronisation SQLite est réservée à Android.");
}
