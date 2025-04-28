import Image from "next/image";
import WhiteIcon from '../../public/WhiteIcon.png'
import LanguageSwitcher from "../common/LanguageSwitcher";

export default function Header() {
  return (
    <header className="bg-blue-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="space-x-4 flex items-center">
          <Image src={WhiteIcon} alt="White Icon of RoomRadar" className="h-10 w-10" />
          <h1 className="text-xl font-bold">RoomRadar</h1>
        </div>
        <nav className="space-x-4">
          <a href="/app" className="hover:underline">Inicio</a>
          <a href="/app" className="hover:underline">Destinos</a>
          <a href="/app" className="hover:underline">Contacto</a>
        </nav>
        <div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}