import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline';

type StarRatingProps = {
    rating?: number; // 1 a 5
};

export default function StarRating({ rating }: Readonly<StarRatingProps>) {
    const safeRating = rating ?? 0;
    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((num) =>
                num <= safeRating ? (
                    <SolidStarIcon key={num} className="w-6 h-6 text-yellow-400" />
                ) : (
                    <OutlineStarIcon key={num} className="w-6 h-6 text-gray-300" />
                )
            )}
        </div>
    );
}