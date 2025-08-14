import toast from 'react-hot-toast';

// services/favoriteService.ts
export async function fetchUserFavoritesList() {
    try {
        const getCookie = (name: string) => {
            const match = RegExp('(^| )' + name + '=([^;]+)').exec(document.cookie);
            return match ? match[2] : null;
        };
        const token = getCookie('token');

        if (!token) {
            console.warn('Usuario no logueado. No se pueden cargar favoritos.');
            return [];
        }

        const res = await fetch(`http://localhost:8082/api/favorites/v1/favorites`, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) throw new Error("Error al obtener favoritos");

        const data = await res.json();
        return data.favorites || [];
    } catch (error) {
        console.error("Error al obtener favoritos:", error);
        return [];
    }
}


export async function fetchUserFavorites() {
    try {
        const res = await fetch("http://localhost:8082/api/favorites/v1/favorites", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error("Error al obtener favoritos");

        const data = await res.json();
        const hotelIds = data.favorites.map((fav: { hotel: { id: any } }) => fav.hotel.id);
        return hotelIds;
    } catch (error) {
        console.error("Error al obtener favoritos:", error);
        return [];
    }
}

export async function addUserFavorite(hotelId: number) {
    try {
        const getCookie = (name: string) => {
            const match = RegExp('(^| )' + name + '=([^;]+)').exec(document.cookie);
            return match ? match[2] : null;
        };
        const token = getCookie('token');

        if (!token) {
            toast('Tienes que estar logueado para añadir favoritos', {
                icon: '⚠️',
            });
            return null;
        }

        const res = await fetch("http://localhost:8082/api/favorites/v1/favorites", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ hotelId }),
        });

        if (!res.ok) throw new Error("Error al añadir favorito");

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error al añadir favorito:", error);
        return null;
    }
}

export async function removeUserFavorite(hotelId: number) {
    try {
        const getCookie = (name: string) => {
            const match = RegExp('(^| )' + name + '=([^;]+)').exec(document.cookie);
            return match ? match[2] : null;
        };
        const token = getCookie('token');

        if (!token) {
            toast('Tienes que estar logueado para eliminar favoritos', {
                icon: '⚠️',
            });
            return null;
        }

        const res = await fetch(`http://localhost:8082/api/favorites/v1/favorites/${hotelId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!res.ok) throw new Error("Error al eliminar favorito");

        return true;
    } catch (error) {
        console.error("Error al eliminar favorito:", error);
        return null;
    }
}
