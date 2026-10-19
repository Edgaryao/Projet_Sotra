export async function getDatabase(): Promise<never> {
  throw new Error(
    "SQLite est réservé à Android. Sur le Web, utilise Supabase.",
  );
}
