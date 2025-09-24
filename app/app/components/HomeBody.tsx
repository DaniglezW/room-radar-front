'use client';

import { useEffect, useState } from 'react';
import HorizontalScroll from './HorizontalScroll';
import { Hotel } from '../types/Hotel';
import { Country } from '../types/Country';
import SearchResultsList from './SearchResultList';
import { useTranslation } from 'react-i18next';
import { HotelWithRating } from '../types/hotelSearched';
import Hotels404 from '../../public/Hotels404.png';
import Image from 'next/image';

interface HomeBodyProps {
  searchedHotels: HotelWithRating[] | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  maxGuests: number | null;
  serviceIds: number[];
}

export default function HomeBody({ searchedHotels, checkInDate, checkOutDate, maxGuests, serviceIds }: Readonly<HomeBodyProps>) {
  const [topHotels, setTopHotels] = useState<Hotel[]>([]);
  const [latestHotels, setLatestHotels] = useState<Hotel[]>([]);
  const [recommendedHotels, setRecommendedHotels] = useState<Hotel[]>([]);
  const [popularCities, setPopularCities] = useState<Country[]>([]);

  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);

  const { t } = useTranslation();
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

  if (searchedHotels !== null) {
    return (
      <section className="p-6 max-w-6xl mx-auto space-y-10">
        {searchedHotels.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{t("homeBody.searchResults")}</h2>
            <SearchResultsList
              hotels={searchedHotels}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              maxGuests={maxGuests}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Image src={Hotels404} alt="No hotels found" width={640} height={640} />
            <p className="text-center text-xl font-semibold text-gray-500">
              {t("homeBody.noHotels")}
            </p>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="p-6 max-w-6xl mx-auto space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t("homeBody.topHotels")}</h2>
        <HorizontalScroll loading={loadingTop} items={topHotels} type='hotel' />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">{t("homeBody.latestHotels")}</h2>
        <HorizontalScroll loading={loadingLatest} items={latestHotels} type='hotel' />
      </div>

      {/* <div>
        <h2 className="text-2xl font-bold mb-4">{t("homeBody.recommendedHotels")}</h2>
        <HorizontalScroll loading={loadingRecommended} items={recommendedHotels} type='hotel' />
      </div> */}

      <div>
        <h2 className="text-2xl font-bold mb-4">{t("homeBody.popularDestinations")}</h2>
        <HorizontalScroll loading={loadingCities} items={popularCities} type='country' />
      </div>
    </section>
  );
}