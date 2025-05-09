export async function fetchSearchResults(query: string) {
  if (!query) return [];

  try {
    const res = await fetch(`http://localhost:8082/api/hotel/v1/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Error en la búsqueda");

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error al obtener resultados:", error);
    return [];
  }
}