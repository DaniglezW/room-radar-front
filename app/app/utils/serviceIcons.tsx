// utils/serviceIcons.tsx
import {
  Wifi,
  ParkingCircle,
  Waves,
  Dumbbell,
  Utensils,
  Martini,
  Bath,
  BedDouble,
  Snowflake,
  Plane,
  Accessibility,
  PawPrint,
  Coffee,
  Briefcase,
  Clock,
  WashingMachine,
  ShieldCheck,
  Tv,
  Wine,
  Sparkles,
  ConciergeBell,
} from "lucide-react";
import { JSX } from "react";

export const serviceIcons: Record<number, JSX.Element> = {
  1: <Wifi className="w-5 h-5" />, // Wi-Fi
  2: <ParkingCircle className="w-5 h-5" />, // Aparcamiento
  3: <Waves className="w-5 h-5" />, // Piscina
  4: <Dumbbell className="w-5 h-5" />, // Gimnasio
  5: <Utensils className="tw-5 h-5" />, // Restaurante
  6: <Martini className="tew-5 h-5" />, // Bar
  7: <Bath className="w-5 h-5" />, // Spa
  8: <BedDouble className="tw-5 h-5" />, // Servicio de habitaciones
  9: <Snowflake className="w-5 h-5" />, // Aire acondicionado
 10: <Plane className="tew-5 h-5" />, // Transporte al aeropuerto
 11: <Accessibility className="w-5 h-5" />, // Acceso PMR
 12: <PawPrint className="tew-5 h-5" />, // Admite mascotas
 13: <Coffee className="tew-5 h-5" />, // Desayuno incluido
 14: <Briefcase className="w-5 h-5" />, // Centro de negocios
 15: <Clock className="tew-5 h-5" />, // Recepción 24h
 16: <WashingMachine className="w-5 h-5" />, // Lavandería
 17: <ShieldCheck className="texw-5 h-5" />, // Caja fuerte
 18: <Tv className="w-5 h-5" />, // TV por cable
 19: <Wine className="texw-5 h-5" />, // Minibar
 20: <Sparkles className="w-5 h-5" />, // Limpieza diaria
};

export const defaultIcon = <ConciergeBell className="w-5 h-5 text-gray-400" />;