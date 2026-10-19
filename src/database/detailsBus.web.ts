import { supabase } from "../lib/supabase";

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
  const { data, error } = await supabase
    .from("parcours")
    .select("id, nom, ligne_id, lignes(numero)")
    .eq("id", parcoursId)
    .maybeSingle();

  if (error) {
    console.error("Erreur récupération parcours :", error);
    return null;
  }

  if (!data) return null;

  const ligne = Array.isArray(data.lignes) ? data.lignes[0] : data.lignes;

  if (!ligne) return null;

  return {
    id: Number(data.id),
    nom: data.nom,
    ligne_id: Number(data.ligne_id),
    numero_ligne: String(ligne.numero),
  };
}

export async function recupererArretsParcours(
  parcoursId: number,
): Promise<ArretDetail[]> {
  const { data, error } = await supabase
    .from("parcours_arrets")
    .select("ordre, arrets(id, nom, latitude, longitude)")
    .eq("parcours_id", parcoursId)
    .order("ordre", { ascending: true });

  if (error) {
    console.error("Erreur récupération arrêts du parcours :", error);
    return [];
  }

  return (data ?? []).flatMap((item) => {
    const arret = Array.isArray(item.arrets) ? item.arrets[0] : item.arrets;

    if (!arret) return [];

    return [
      {
        id: Number(arret.id),
        nom: arret.nom,
        latitude: arret.latitude == null ? null : Number(arret.latitude),
        longitude: arret.longitude == null ? null : Number(arret.longitude),
      },
    ];
  });
}

export async function recupererArretsAvecCoordonnees(): Promise<ArretDetail[]> {
  const { data, error } = await supabase
    .from("arrets")
    .select("id, nom, latitude, longitude")
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (error) {
    console.error("Erreur récupération coordonnées :", error);
    return [];
  }

  return (data ?? []).map((arret) => ({
    id: Number(arret.id),
    nom: arret.nom,
    latitude: arret.latitude == null ? null : Number(arret.latitude),
    longitude: arret.longitude == null ? null : Number(arret.longitude),
  }));
}

export async function recupererArret(
  arretId: number,
): Promise<ArretDetail | null> {
  const { data, error } = await supabase
    .from("arrets")
    .select("id, nom, latitude, longitude")
    .eq("id", arretId)
    .maybeSingle();

  if (error) {
    console.error("Erreur récupération arrêt :", error);
    return null;
  }

  if (!data) return null;

  return {
    id: Number(data.id),
    nom: data.nom,
    latitude: data.latitude == null ? null : Number(data.latitude),
    longitude: data.longitude == null ? null : Number(data.longitude),
  };
}

export async function recupererParcoursLigne(
  ligneId: number,
): Promise<ParcoursLigneDetail[]> {
  const { data, error } = await supabase
    .from("parcours")
    .select("id, nom, ligne_id")
    .eq("ligne_id", ligneId)
    .order("id", { ascending: true });

  if (error) {
    console.error("Erreur récupération parcours de ligne :", error);
    return [];
  }

  return (data ?? []).map((parcours) => ({
    id: Number(parcours.id),
    nom: parcours.nom,
    ligne_id: Number(parcours.ligne_id),
  }));
}

export async function recupererNumeroLigne(
  ligneId: number,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("lignes")
    .select("numero")
    .eq("id", ligneId)
    .maybeSingle();

  if (error) {
    console.error("Erreur récupération numéro de ligne :", error);
    return null;
  }

  return data?.numero == null ? null : String(data.numero);
}

export async function recupererLignesArret(
  arretId: number,
): Promise<LigneArretDetail[]> {
  const { data, error } = await supabase
    .from("parcours_arrets")
    .select("parcours:parcours_id(id, nom, lignes:ligne_id(id, numero, nom))")
    .eq("arret_id", arretId);

  if (error) {
    console.error("Erreur récupération lignes de l'arrêt :", error);
    return [];
  }

  const lignes = new Map<number, LigneArretDetail>();

  for (const item of data ?? []) {
    const parcours = Array.isArray(item.parcours)
      ? item.parcours[0]
      : item.parcours;

    if (!parcours) continue;

    const ligne = Array.isArray(parcours.lignes)
      ? parcours.lignes[0]
      : parcours.lignes;

    if (!ligne) continue;

    const id = Number(ligne.id);
    const existante = lignes.get(id);

    const nomParcours = parcours.nom ?? "";

    if (existante) {
      const noms = existante.parcours_nom
        ? existante.parcours_nom.split(", ")
        : [];

      if (nomParcours && !noms.includes(nomParcours)) {
        existante.parcours_nom = [...noms, nomParcours].join(", ");
      }
    } else {
      lignes.set(id, {
        id,
        numero: String(ligne.numero),
        nom: ligne.nom ?? null,
        parcours_nom: nomParcours,
      });
    }
  }

  return Array.from(lignes.values()).sort((a, b) =>
    a.numero.localeCompare(b.numero, undefined, { numeric: true }),
  );
}
