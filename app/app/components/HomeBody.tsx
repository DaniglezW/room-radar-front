'use client';

import { useEffect, useState } from 'react';
import HorizontalScroll from './HorizontalScroll';

type Hotel = {
  id: number;
  name: string;
  city: string;
  country: string;
  description?: string;
  stars?: number;
  images: {
    id: number;
    imageData: string | null;
    description?: string;
    isMain: boolean;
  }[];
};

export default function HomeBody() {
  const [topHotels, setTopHotels] = useState<Hotel[]>([]);
  const [latestHotels, setLatestHotels] = useState<Hotel[]>([]);
  const [recommendedHotels, setRecommendedHotels] = useState<Hotel[]>([]);
  const [popularCities, setPopularCities] = useState<string[]>([]);

  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

  useEffect(() => {
    fetch(`${baseUrl}/hotel/v1/top-rated`)
      .then(res => res.json())
      .then(data => setTopHotels(data.hotels ?? []))
      .finally(() => setLoadingTop(false));

    fetch(`${baseUrl}/hotel/v1/latest`)
      .then(res => res.json())
      .then(data => setLatestHotels(data.hotels ?? []))
      .finally(() => setLoadingLatest(false));

    fetch(`${baseUrl}/hotel/v1/most-favorited`)
      .then(res => res.json())
      .then(data => setRecommendedHotels(data.hotels ?? []))
      .finally(() => setLoadingRecommended(false));

      const fetchPopularCitiesWithImages = async () => {
        try {
          const res = await fetch(`${baseUrl}/hotel/v1/popular-destinations`);
          const countries: string[] = await res.json();
  
          // Enviar los nombres de los países al endpoint que devuelve el número de alojamientos por país
          const accommodationCounts = await fetch(`${baseUrl}/hotel/v1/accommodations-by-country`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(countries),
          });
          const accommodationData = await accommodationCounts.json();
  
          const imageFetches = countries.map(async (name) => {
            try {
              const response = await fetch(
                `https://pixabay.com/api/?key=50172934-916d0c37f58b76dd39eff8b78&q=${encodeURIComponent(name)}&image_type=photo&category=places&safesearch=true`
              );
              const data = await response.json();
              const image = data.hits?.[0]?.webformatURL ?? '/defaultCountry.jpg';
  
              // Buscar el número de alojamientos para cada país
              const accommodationCount = accommodationData.find((item: any) => item.country === name)?.accommodations ?? 0;
  
              return {
                name,
                image,
                accommodations: accommodationCount,
              };
            } catch (error) {
              console.error('Error fetching image for', name, error);
              return {
                name,
                image: '/defaultCountry.jpg',
                accommodations: 0,
              };
            }
          });
  
          const countriesWithImages = await Promise.all(imageFetches);
          setPopularCities(countriesWithImages);
        } catch (error) {
          console.error('Error fetching popular cities:', error);
        } finally {
          setLoadingCities(false);
        }
      };
      fetchPopularCitiesWithImages();
  }, []);

  return (
    <section className="p-6 max-w-6xl mx-auto space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-4">Hoteles mejor valorados</h2>
        <HorizontalScroll loading={loadingTop} items={topHotels} type='hotel' />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Nuevos descubrimientos</h2>
        <HorizontalScroll loading={loadingLatest} items={latestHotels} type='hotel' />
      </div>

      {/* <div>
        <h2 className="text-2xl font-bold mb-4">Recomendado para ti</h2>
        <HorizontalScroll loading={loadingRecommended} items={recommendedHotels} type='hotel' />
      </div> */}

      <div>
        <h2 className="text-2xl font-bold mb-4">Destinos más populares</h2>
        <HorizontalScroll loading={loadingCities} items={popularCities} type='country' />
      </div>
    </section>
  );
}