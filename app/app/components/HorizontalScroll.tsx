'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Hotel } from '../types/Hotel';
import Image from 'next/image';
import DefaultHotelImage from '../../public/defaultHotel.png';
import DefaultCountryImage from '../../public/defaultCountry.png';
import { useMediaQuery } from 'react-responsive';
import { Country } from '../types/Country';

type ScrollItem = Hotel | Country;

interface HorizontalScrollProps<T extends ScrollItem> {
  loading: boolean;
  items: T[];
  type: 'hotel' | 'country';
  className?: string;
}

export default function HorizontalScroll<T extends ScrollItem>({
  loading = false,
  items,
  type = 'hotel',
  className = '',
}: HorizontalScrollProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 640 });

  useEffect(() => {
    if (!loading && scrollRef.current) {
      const scrollable = scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
      setCanScrollRight(scrollable);
    }
  }, [loading, items]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setCanScrollLeft(scrollRef.current.scrollLeft > 0);
        setCanScrollRight(
          scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth
        );
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  const renderSkeletonCard = (_: any, idx: number) => (
    <div
      key={idx}
      className={`p-4 border rounded-lg shadow animate-pulse w-56 sm:w-60 md:w-64 h-[${type === 'hotel' ? '22rem' : '16rem'}] flex flex-col justify-between`}
    >
      <div className="h-40 bg-gray-300 mb-4 rounded-md" />
      <div className="space-y-2">
        <div className="h-5 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        {type === 'hotel' && <>
          <div className="h-4 bg-gray-300 rounded w-1/3" />
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-2/3" />
        </>}
      </div>
    </div>
  );

  const renderHotelCard = (hotel: Hotel) => {
    const mainImage = hotel.images.find(img => img.isMain);

    return (
      <div
        key={hotel.id}
        className="p-4 border rounded-lg shadow hover:shadow-lg transition cursor-pointer w-56 sm:w-60 md:w-64 h-[22rem] flex flex-col justify-between"
        onClick={() => router.push(`/hotel/${hotel.id}`)}
      >
        <div className="h-40 bg-gray-200 mb-4 rounded-md relative overflow-hidden">
          <Image
            src={mainImage?.imageData ? `data:image/jpeg;base64,${mainImage?.imageData}` : DefaultHotelImage}
            alt={mainImage?.description ?? 'Imagen del hotel'}
            fill
            sizes="(max-width: 640px) 100vw, 256px"
            className="object-contain object-center bg-white rounded-md"
            priority
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold truncate">{hotel.name}</h3>
          <p className="text-sm text-gray-600 truncate">
            {hotel.city}, {hotel.country}
          </p>
          {hotel.stars && (
            <p className="mt-1 text-yellow-500">⭐ {hotel.stars} estrellas</p>
          )}
          {hotel.description && (
            <p className="text-sm mt-2 text-gray-700 line-clamp-3">{hotel.description}</p>
          )}
        </div>
      </div>
    );
  };

  const renderCountryCard = (country: Country, index: number) => (
    <div
      key={index}
      className="p-4 rounded-lg transition w-56 sm:w-60 md:w-64 h-[14rem] flex flex-col items-start justify-between cursor-default"
    >
      <div className="relative w-full h-32 aspect-[3/2] bg-gray-200 mb-2 rounded-md overflow-hidden">
        <Image
          src={country.image ?? DefaultCountryImage}
          alt={`Imagen de ${country.name}`}
          fill
          sizes="(max-width: 640px) 100vw, 256px"
          className="object-cover object-center"
        />
      </div>
      <div className="text-left w-full">
        <h3 className="text-lg font-semibold">{country.name}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {country.accommodations.toLocaleString('es-ES')} alojamientos
        </p>
      </div>
    </div>
  );

  const isScrollable = !isMobile && !loading && items.length > 1;

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {isScrollable && canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-100"
          aria-label="Scroll Left"
        >
          ◀
        </button>
      )}

      <div
        ref={scrollRef}
        className={`flex ${isMobile ? 'flex-col' : 'overflow-x-auto no-scrollbar'} gap-4 ${loading ? 'overflow-x-hidden' : ''}`}
      >
        {(loading ? Array.from({ length: 4 }) : items).map((item, index) => (
          <div key={index} className="flex-shrink-0">
            {loading
              ? renderSkeletonCard(item, index)
              : type === 'hotel'
                ? renderHotelCard(item as Hotel)
                : renderCountryCard(item as Country, index)}
          </div>
        ))}
      </div>

      {isScrollable && canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-100"
          aria-label="Scroll Right"
        >
          ▶
        </button>
      )}
    </div>
  );
}