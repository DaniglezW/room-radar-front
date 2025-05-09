import Image from "next/image";
import WhiteIcon from '../../public/WhiteIcon.png'
import LanguageSwitcher from "../common/LanguageSwitcher";
import CurrencySwitcher from "../common/CurrencySwitcher";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-900 shadow-sm">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse hover:opacity-80 transition">
            <Image src={WhiteIcon} alt="White Icon of RoomRadar" className="h-10 w-10" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">RoomRadar</span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li className="hover:underline me-4 md:me-6">
              <CurrencySwitcher />
            </li>
            <li className="hover:underline me-4 md:me-6">
              <LanguageSwitcher />
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">About</a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Contact</a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-white-200 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a href="https://room-radar.vercel.app/" className="hover:underline">RoomRadar</a>. All Rights Reserved.</span>
      </div>
    </footer>
  );
}