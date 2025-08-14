import { useEffect, useState } from "react";
import { addUserFavorite, removeUserFavorite } from "../services/favoriteService";
import { Heart } from "lucide-react";
import { clsx } from "yet-another-react-lightbox";

interface HeartToggleProps {
    isFavoriteProp: boolean,
    itemId: number
}

export default function HeartToggle({ isFavoriteProp, itemId }: Readonly<HeartToggleProps>) {
    const [isFavorite, setIsFavorite] = useState(isFavoriteProp);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsFavorite(isFavoriteProp);
    }, [isFavoriteProp]);

    const toggleFavorite = async () => {
        if (loading) return;
        setLoading(true);

        try {
            if (isFavorite) {
                // Si ya es favorito, eliminar
                const result = await removeUserFavorite(itemId);
                if (result) setIsFavorite(false);
            } else {
                // Si no es favorito, añadir
                const result = await addUserFavorite(itemId);
                if (result) setIsFavorite(true);
            }
        } catch (error) {
            console.error(error);
            setIsFavorite(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            className={clsx(
                "transition-transform duration-200 p-2 rounded-full",
                isFavorite ? "text-red-500 scale-110" : "text-gray-400 hover:text-red-400",
                loading && "opacity-50 cursor-not-allowed"
            )}
        >
            <Heart fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" />
        </button>
    );
}
