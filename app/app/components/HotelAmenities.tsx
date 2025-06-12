// components/HotelAmenities.tsx
import { serviceIcons, defaultIcon } from "../utils/serviceIcons";
import { Service } from "../types/Service";

const HotelAmenities = ({ services }: { services: Service[] }) => (
    <ul className="grid grid-cols-2 gap-3">
        {services.map((service) => (
            <li key={service.id} className="flex items-center gap-2">
                {serviceIcons[service.id] || defaultIcon}
                <span className="text-sm text-gray-700">{service.name}</span>
            </li>
        ))}
    </ul>
);

export default HotelAmenities;