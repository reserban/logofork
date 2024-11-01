"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Formats from "./Formats";

interface HeroProps {
  setShowUploadForm: Dispatch<SetStateAction<boolean>>;
}

export default function Hero({ setShowUploadForm }: HeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8883_1px,transparent_1px),linear-gradient(to_bottom,#8883_1px,transparent_1px)] bg-[size:40px_40px] before:absolute before:inset-0 before:bg-gradient-to-t before:from-secondary-500/90 before:via-secondary-500/30 before:to-secondary-500/90 before:z-10" />
        <div className="pt-0 sm:pt-4 lg:pb-8 text-left sm:text-center">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-left sm:text-center">
              <h1 className="mx-auto max-w-2xl text-4xl font-semibold text-secondary-400 sm:text-6xl lg:col-span-2 xl:col-auto text-left sm:text-center items-center">
                Full Package From{" "}
                <span className="text-primary-500">A Vector File</span>
              </h1>
              <p className="mt-6 text-lg text-secondary-400 max-w-xl mx-auto text-left font-medium sm:text-center">
                Drag and drop, paste, or upload your SVG logos and get every
                file type you or your client needs, in seconds.
              </p>
              <div className="mt-6 mb-2 flex items-center justify-start sm:justify-center gap-x-6">
                <button
                  data-umami-event="start button"
                  onClick={() => !isMobile && setShowUploadForm(true)}
                  className="cursor-pointer rounded-lg bg-primary-500 px-5 py-3 text-md font-semibold text-secondary-400 shadow-sm hover:bg-primary-500/5 hover:border-primary-500/60 hover:text-primary-500 border-primary-500/20 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transform transition-transform duration-500 hover:scale-105 disabled:bg-primary-700 disabled:cursor-not-allowed"
                  disabled={isMobile}
                >
                  <span className="md:hidden">Start On Desktop </span>
                  <span className="hidden sm:inline">Start Now </span>
                  <span className="font-normal">- It&apos;s free</span>
                </button>
              </div>
            </div>
          </div>
          <Formats />
        </div>
      </div>
    </>
  );
}
