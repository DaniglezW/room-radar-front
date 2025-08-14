import { HotelSearchRequest } from "../types/HotelSearchRequest";

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

export async function searchHotels(data: HotelSearchRequest) {
  try {
    const response = await fetch(`http://localhost:8082/api/hotel/v1/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error searching hotels");
    }

    return await response.json();
  } catch (error) {
    console.error("Search hotels failed:", error);
    throw error;
  }
}
