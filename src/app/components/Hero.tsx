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
    <div>
      <svg
        className="absolute top-48 sm:top-2 sm:-left-5 left-1/2 transform -translate-x-1/2 sm:translate-x-0 -z-10 sm:h-[60rem] h-[32rem] w-full stroke-primary-500/20 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
            width={180}
            height={180}
            x="116.3%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
        />
      </svg>
      <div className="pt-4 lg:pb-12 text-left sm:text-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-left sm:text-center">
            <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-6xl lg:col-span-2 xl:col-auto">
              A Complete Package{" "}
              <span className="text-primary-500">From Your Designs</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-white">
              Just drag and drop, paste, or upload your SVGs, give that generate
              button a click, and watch as every file type someone could need is
              added to your package — while you save time and deliver the
              project like a pro.
            </p>
            <div className="mt-10 flex items-center sm:justify-center gap-x-6">
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
