"use client";

import { useState, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

// Define the type for the props
interface HeroProps {
  setShowUploadForm: Dispatch<SetStateAction<boolean>>;
}

export default function Hero({ setShowUploadForm }: HeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative">
      <div className="pt-0 sm:pt-4 lg:pb-12 text-left sm:text-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-left sm:text-center">
            <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-6xl lg:col-span-2 xl:col-auto text-left sm:text-center items-center">
              Complete Package{" "}
              <span className="text-primary-500">From Your Designs</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-white max-w-xl mx-auto text-left sm:text-center">
              Drag-and-drop, paste or upload your SVGs, hit the generate button
              and instantly get every file type you or your client needs.
            </p>
            <div className="mt-6 flex items-center justify-start sm:justify-center gap-x-6">
              <button
                onClick={() => setShowUploadForm(true)}
                className="cursor-pointer rounded-bl-xl rounded-tr-xl bg-primary-500 px-3.5 py-2.5 text-sm font-bold text-secondary-400 shadow-sm hover:bg-primary-500/5 hover:border-primary-500/60 hover:text-primary-500 border-primary-500/20 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transform transition-transform duration-500 hover:scale-105"
              >
                <span className="sm:hidden">Start On Desktop</span>
                <span className="hidden sm:inline">Start Now </span>
                <span className="font-normal">- It&apos;s free</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
