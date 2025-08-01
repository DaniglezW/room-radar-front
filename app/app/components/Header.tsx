'use client';

import Image from "next/image";
import WhiteIcon from '../../public/WhiteIcon.png';
import LanguageSwitcher from "../common/LanguageSwitcher";
import CurrencySwitcher from "../common/CurrencySwitcher";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UserDTO {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  profilePicture: string;
  googleProfilePictureUrl: string;
  createdAt: string;
}

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [user, setUser] = useState<UserDTO | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_AUTH_URL + "/auth/me", {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const renderUserAvatar = (user: UserDTO) => {
    if (user.profilePicture) {
      return (
        <Image
          src={`data:image/jpeg;base64,${user.profilePicture}`}
          alt="User"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      );
    }

    if (user.googleProfilePictureUrl) {
      return (
        <Image
          src={user.googleProfilePictureUrl}
          alt="User"
          width={40}
          height={40}
          className="inline-block rounded-full object-cover"
        />
      );
    }

    return (
      <div className="w-10 h-10 bg-white text-blue-900 font-bold rounded-full flex items-center justify-center">
        {user.fullName?.[0] ?? "U"}
      </div>
    );
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <header className="bg-blue-900 text-white px-6 py-4 shadow-md w-full">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo + Nombre */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
          <Image src={WhiteIcon} alt="RoomRadar Logo" width={40} height={40} />
          <h1 className="text-xl font-bold">RoomRadar</h1>
        </Link>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />

          {!isAuthPage && !user && (
            <>
              <CurrencySwitcher />

              <Link href="/register-property">
                <button className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition min-w-[180px] text-center">
                  {t("header.registerProperty")}
                </button>
              </Link>

              <Link href="/register">
                <button className="bg-white text-blue-900 font-semibold hover:bg-blue-100 px-4 py-2 rounded-lg transition min-w-[140px] text-center">
                  {t("header.register")}
                </button>
              </Link>

              <Link href="/login">
                <button className="bg-white text-blue-900 font-semibold hover:bg-blue-100 px-4 py-2 rounded-lg transition min-w-[140px] text-center">
                  {t("header.login")}
                </button>
              </Link>
            </>
          )}

          {!isAuthPage && user && (
            <>
              <CurrencySwitcher />

              <span className="text-sm">{user.fullName}</span>

              <div className="relative" ref={dropdownRef}>
                {user && (
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full overflow-hidden border-none bg-transparent p-0 cursor-pointer"
                    aria-label="Open profile dropdown"
                  >
                    {renderUserAvatar(user)}
                  </button>
                )}


                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-blue-900 rounded-lg shadow-lg z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-blue-100 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Perfil
                    </Link>
                    <button
                      onClick={() => {
                        fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`, {
                          method: 'POST',
                          credentials: 'include',
                        }).then(() => {
                          window.location.href = "/app";
                        });
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-100 transition"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}