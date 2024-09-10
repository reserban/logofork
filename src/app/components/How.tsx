import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  DocumentArrowUpIcon,
  WalletIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface CardProps {
  image: string;
  opacity: number;
  className?: string;
  imageWidth: number;
  imageHeight: number;
}

const Card: React.FC<CardProps> = ({
  image,
  opacity,
  className,
  imageWidth,
  imageHeight,
}) => (
  <div
    className={`mt-0 sm:mt-8 ring-1 ring-gray-400/10 sm:w-[33.8rem] sm:h-[16rem] w-[24rem] text-white p-6 rounded-tr-ct rounded-bl-ct border shadow-lg transition-transform duration-700 hover:-translate-y-1 ${className}`} // Fixed card size
  >
    <div className="flex justify-center items-center w-full h-full">
      <Image
        src={image}
        alt="Card Image"
        width={imageWidth} // Set image width
        height={imageHeight} // Set image height
        style={{ opacity, transition: "opacity 0.7s, width 0.7s, height 0.7s" }} // Add transition
        className="rounded-tr-ct rounded-bl-ct"
      />
    </div>
  </div>
);

export default function How() {
  const [cardState, setCardState] = useState("default");

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setCardState("how2"); // Set to the final state on mobile
      } else {
        const useClientElement = document.getElementById("how2");
        const cardElement = document.getElementById("sticky-card");
        const how1Element = document.getElementById("how1");
        if (useClientElement && cardElement && how1Element) {
          const useClientRect = useClientElement.getBoundingClientRect();
          const cardRect = cardElement.getBoundingClientRect();
          const how1Rect = how1Element.getBoundingClientRect();

          if (
            cardRect.top < useClientRect.bottom &&
            cardRect.bottom > useClientRect.top
          ) {
            setCardState("how2");
          } else if (
            cardRect.top < how1Rect.bottom &&
            cardRect.bottom > how1Rect.top
          ) {
            setCardState("how1");
          } else {
            setCardState("default");
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section
        id="how"
        className="flex items-center justify-center min-h-screen"
      >
        <div className="relative px-6 pt-6 sm:pt-0 mt-20 pb-4 sm:pb-20 overflow-hidden isolate sm:py-28 lg:overflow-visible lg:px-0">
          <div className="absolute inset-0 overflow-hidden -z-10"></div>
          <div className="grid max-w-2xl sm:max-w-4xl grid-cols-1 mx-auto gap-x-48 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-8">
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
              <div className="lg:pr-4">
                <div className="max-w-2xl sm:max-w-5xl lg:max-w-xl mx-auto lg:mx-0">
                  <h2 className="text-3xl font-bold tracking-tight text-primary-500 sm:text-4xl">
                    Pack Pack Pack
                  </h2>
                  <p className="mt-6 text-xl max-w-2xl leading-7 text-white">
                    This product was born from a problem I faced when switching
                    design software. Adobe had some community logo export
                    plugins, but when I moved to Affinity, I found no tools to
                    solve this issue.
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
              <div className="lg:pr-4">
                <div className="max-w-2xl text-lg leading-7 text-white lg:max-w-xl">
                  <ul role="list" className="space-y-8 text-white text-xl">
                    <li className="flex gap-x-3">
                      <WalletIcon
                        className="flex-none w-5 h-5 mt-1 text-primary-500"
                        aria-hidden="true"
                      />
                      <span>
                        Packer works with whatever you are using, be it
                        Illustrator, Affinity Designer, or Inkscape. It&apos;s
                        designed to support you across different platforms.
                      </span>
                    </li>
                    <li className="flex gap-x-3" id="how1">
                      <DocumentArrowUpIcon
                        className="flex-none w-5 h-5 mt-1 text-primary-500"
                        aria-hidden="true"
                      />
                      <span>
                        Why fewer options than other similar softwares? I
                        believe more options can confuse users. That&apos;s why
                        we keep Packer simple and consistent for everyone.
                      </span>
                    </li>
                  </ul>
                  <i>
                    {" "}
                    <p className="mt-6 font-light opacity-60">
                      Alexandru Serban - Founder @ Unzet
                    </p>
                  </i>
                  <h2
                    className="mt-10 text-2xl font-bold tracking-tight text-primary-500"
                    id="how2"
                  >
                    Your support is important
                  </h2>
                  <p className="mt-6 text-xl leading-7 text-white">
                    Packer isn&apos;t perfect, but it&apos;s a powerful tool.
                    We&apos;re here to improve it and make it the best it can
                    be.
                  </p>
                  <p className="mt-6 text-xl leading-7 text-white">
                    This is where you come in. Support Packer by giving
                    feedback, donating to keep it running, or simply spreading
                    the word. Your support motivates us to keep going.
                  </p>
                </div>
                <div className="flex items-center mt-10 gap-x-6">
                  <Link
                    href="https://discord.gg/W3ukzkXe2y"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer rounded-bl-xl rounded-tr-xl bg-primary-500 px-3.5 py-2.5 text-sm font-bold text-secondary-400 shadow-sm hover:bg-primary-500/5 hover:border-primary-500/60 hover:text-primary-500 border-primary-500/20 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transform transition-transform duration-500 hover:scale-105"
                  >
                    Join Discord
                  </Link>
                  <Link
                    href="https://buymeacoffee.com/theserban"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex text-sm font-semibold leading-6 text-white transition-all duration-500 transform gap-x-0.5 hover:gap-x-1 hover:scale-105 hover:text-primary-500 cursor-pointer"
                  >
                    Donate
                    <ChevronRightIcon className="w-4 mt-1 h-4" />
                  </Link>
                </div>
              </div>
            </div>
            <div
              id="sticky-card"
              className="pt-5 mt-0 pl-12 sm:pl-5 pr-12 sm:-mt-12 -ml-12 sm:-ml-4 lg:-ml-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden transition-all duration-700" // Add transition
            >
              {cardState === "default" && (
                <Card
                  image="photos/horizontal.svg"
                  opacity={0.5}
                  className="border-2 border-dashed border-primary-500/40 bg-black/60"
                  imageWidth={380}
                  imageHeight={280}
                />
              )}
              {cardState === "how1" && (
                <Card
                  image="photos/horizontal_hover.svg"
                  opacity={1}
                  className="border-2 border-primary-500/40 bg-primary-500/10"
                  imageWidth={540}
                  imageHeight={440}
                />
              )}
              {cardState === "how2" && (
                <Card
                  image="photos/horizontal_selected.svg"
                  opacity={1}
                  className="border-2 border-primary-500 bg-primary-500/20"
                  imageWidth={460}
                  imageHeight={360}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
