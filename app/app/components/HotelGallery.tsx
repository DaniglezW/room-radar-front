'use client';

import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { useState } from 'react';

type HotelImage = {
    id: number;
    imageData: string | null;
    description?: string;
    isMain: boolean;
};

export default function HotelGallery({ images }: { images: HotelImage[] }) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    if (images.length === 0) return <p>No hay imágenes disponibles.</p>;

    const slides = images.map((img) => ({
        src: `data:image/jpeg;base64,${img.imageData}`,
        alt: img.description ?? 'Imagen del hotel',
    }));

    const mainImage = images[0];
    const thumbnails = images.slice(1, 5);
    const remaining = images.length - 5;

    return (
        <>
            <div className="grid grid-cols-3 grid-rows-2 gap-2 aspect-[6/3] my-6">
                {/* Imagen principal grande (columna izquierda completa) */}
                <div className="row-span-2 col-span-2">
                    <img
                        src={`data:image/jpeg;base64,${mainImage.imageData}`}
                        alt={mainImage.description ?? 'Imagen principal'}
                        className="w-full h-full object-cover rounded-lg cursor-pointer"
                        onClick={() => {
                            setIndex(0);
                            setOpen(true);
                        }}
                    />
                </div>

                {/* Miniaturas */}
                {thumbnails.map((img, i) => (
                    <img
                        key={img.id}
                        src={`data:image/jpeg;base64,${img.imageData}`}
                        alt={img.description ?? 'Miniatura'}
                        className="w-full h-full object-cover rounded-lg cursor-pointer"
                        onClick={() => {
                            setIndex(i + 1); // +1 porque el main ya está en index 0
                            setOpen(true);
                        }}
                    />
                ))}

                {/* Última miniatura con overlay "X fotos más" si hay más imágenes */}
                {remaining > 0 && (
                    <div
                        className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => {
                            setIndex(5);
                            setOpen(true);
                        }}
                    >
                        <img
                            src={`data:image/jpeg;base64,${images[5].imageData}`}
                            alt="Imagen adicional"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-lg font-semibold">
                            +{remaining} fotos más
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox con thumbnails abajo */}
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={slides}
                index={index}
                plugins={[Thumbnails]}
            />
        </>
    );
}