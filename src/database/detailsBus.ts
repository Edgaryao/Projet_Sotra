import { getDatabase } from "./database";

export type ArretDetail = {
  id: number;
  nom: string;
  latitude: number | null;
  longitude: number | null;
};
export type ParcoursLigneDetail = {
  id: number;
  nom: string;
  ligne_id: number;
};
export type ParcoursDetail = {
  id: number;
  nom: string;
  ligne_id: number;
  numero_ligne: string;
};

export type LigneArretDetail = {
  id: number;
  numero: string;
  nom: string | null;
  parcours_nom: string;
};
export async function recupererParcours(
  parcoursId: number,
): Promise<ParcoursDetail | null> {
  const db = await getDatabase();

  const sql = `
    SELECT
      p.id,
      p.nom,
      p.ligne_id,
      l.numero AS numero_ligne

    FROM parcours p

    JOIN lignes l
      ON l.id = p.ligne_id

    WHERE p.id = ?
  `;

  const resultat = await db.getFirstAsync<ParcoursDetail>(sql, [parcoursId]);

  return resultat ?? null;
}

export async function recupererArretsParcours(
  parcoursId: number,
): Promise<ArretDetail[]> {
  const db = await getDatabase();

  const sql = `
    SELECT
      a.id,
      a.nom,
      a.latitude,
      a.longitude

    FROM parcours_arrets pa

    JOIN arrets a
      ON a.id = pa.arret_id

    WHERE pa.parcours_id = ?

    ORDER BY pa.ordre ASC
  `;

  return await db.getAllAsync<ArretDetail>(sql, [parcoursId]);
}

export async function recupererArret(
  arretId: number,
): Promise<ArretDetail | null> {
  const db = await getDatabase();

  const sql = `
    SELECT
      id,
      nom,
      latitude,
      longitude
    FROM arrets
    WHERE id = ?
  `;

  const resultat = await db.getFirstAsync<ArretDetail>(sql, [arretId]);

  return resultat ?? null;
}

export async function recupererParcoursLigne(
  ligneId: number,
): Promise<ParcoursLigneDetail[]> {
  const db = await getDatabase();

  const sql = `
    SELECT
      p.id,
      p.nom,
      p.ligne_id

    FROM parcours p

    WHERE p.ligne_id = ?

    ORDER BY p.id ASC
  `;

  return await db.getAllAsync<ParcoursLigneDetail>(sql, [ligneId]);
}

export async function recupererNumeroLigne(
  ligneId: number,
): Promise<string | null> {
  const db = await getDatabase();

  const resultat = await db.getFirstAsync<{ numero: string }>(
    "SELECT numero FROM lignes WHERE id = ?",
    [ligneId],
  );

  return resultat?.numero ?? null;
}

export async function recupererLignesArret(
  arretId: number,
): Promise<LigneArretDetail[]> {
  const db = await getDatabase();

  const sql = `
    SELECT DISTINCT
      l.id,
      l.numero,
      l.nom,
      p.nom AS parcours_nom

    FROM parcours_arrets pa

    JOIN parcours p
      ON p.id = pa.parcours_id

    JOIN lignes l
      ON l.id = p.ligne_id

    WHERE pa.arret_id = ?

    ORDER BY l.numero ASC
  `;

  return await db.getAllAsync<LigneArretDetail>(sql, [arretId]);
}
