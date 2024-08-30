import React, { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const UnzetButton = () => (
    <Link href="https://unzet.com" passHref>
      <button
        onClick={() => setMobileMenuOpen(false)}
        className="rounded-tr-lg rounded-bl-lg border-1 border border-white/80 text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-500 transform transition-transform duration-500 hover:scale-105 flex items-center"
        onMouseDown={(e) => {
          if (e.button === 0) {
            window.open("https://unzet.com", "_blank", "noopener,noreferrer");
          }
        }}
      >
        <span className="pr-2">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full bg-white opacity-100 animate-ping"></span>
            <span className="relative inline-flex w-2 h-2 pb-1 bg-white"></span>
          </span>
        </span>{" "}
        Unzet
      </button>
    </Link>
  );

  return (
    <header className="bg-black rounded-br-ct z-50 relative mb-6">
      <nav
        className="flex items-center justify-between p-6 mx-auto max-w-7xl lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/">
            <Image
              className="w-36 h-auto transition-transform duration-500 transform hover:scale-105 cursor-pointer"
              src="/photos/logo.svg"
              alt="Unzet Logo"
              width={128}
              height={32}
            />
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-12"></div>
        <div className="hidden lg:flex lg:items-center">
          <UnzetButton />
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="absolute inset-x-0 z-50 w-full px-4 py-8 bg-black border-b lg:hidden top-16 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 border-primary-500/20 rounded-br-ct">
          <div className="flex flex-col items-start space-y-4">
            <div className="flex w-full justify-between items-center gap-4 pl-2">
              <UnzetButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
