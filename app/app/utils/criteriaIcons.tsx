import { Sparkles, Hand, MapPin } from "lucide-react";
import { JSX } from "react";

export const criteriaIcons: Record<string, JSX.Element> = {
    Limpieza: <Sparkles className="w-5 h-5 text-blue-600" />,
    Servicio: <Hand className="w-5 h-5 text-green-600" />,
    Ubicación: <MapPin className="w-5 h-5 text-red-600" />,
};