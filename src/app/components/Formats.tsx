import Image from "next/image";
import { useEffect, useState, useRef } from "react";

type Item = {
  bigText: string;
  checked: boolean;
};

const initialItems: Item[] = [
  { bigText: ".webp", checked: true },
  { bigText: ".png", checked: true },
  { bigText: ".eps", checked: true },
  { bigText: ".tiff", checked: true },
  { bigText: ".jpg", checked: true },
  { bigText: "_white", checked: true },
  { bigText: ".afdesign", checked: true },
  { bigText: ".ai", checked: true },
  { bigText: "master.svg", checked: true },
  { bigText: "_black", checked: true },
  { bigText: "favicons", checked: true },
];

const shuffleArray = (array: Item[]) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export default function Formats() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const shuffled = shuffleArray(initialItems);
    setItems(shuffled);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalWidth = container.scrollWidth / 2;
    let currentPosition = -totalWidth;

    const animate = () => {
      currentPosition += 0.7;
      if (currentPosition >= 0) {
        currentPosition = -totalWidth;
      }
      container.style.transform = `translateX(${currentPosition}px)`;
      requestAnimationFrame(animate);
    };

    animate();
  }, [items]);

  const renderItems = () => {
    const duplicatedItems = [...items, ...items];
    return duplicatedItems.map((item, index) => (
      <div
        key={index}
        className="hover:-translate-y-1 duration-500 flex-shrink-0 text-center transition-transform transform border px-10 py-5 tool-item rounded-tr-ct rounded-bl-ct bg-secondary-400/60 border-secondary-300/30"
      >
        <div className="h-6 flex items-center justify-center mb-1 mt-1">
          <label className="flex items-center">
            <span
              className="w-5 h-5 inline-block mr-2 rounded border bg-primary-500 opacity-80 border-primary-500"
              style={{ borderWidth: "1px" }}
            >
              <svg
                className="w-4 h-4 text-secondary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ margin: "auto" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </span>
          </label>
          <span className="text-2xl ml-0.5 font-semibold text-white/80">
            {item.bigText}
          </span>
        </div>
      </div>
    ));
  };

  return (
    <section id="formats" className="relative">
      <div className="mx-auto overflow-hidden py-24 pb-0 sm:pt-12 pt-16">
        <div className="relative mx-auto max-w-7xl px-7 lg:px-8 pb-12 flex">
          <div className="w-2/3 h-24 hover:-translate-x-1 duration-500 bg-primary-500/10 border border-primary-500/20 hidden lg:flex rounded-bl-ct items-center justify-center">
            <Image
              className="opacity-90"
              src="photos/svg.svg"
              alt="SVG Logo"
              width={44}
              height={44}
            />
          </div>
          <div className="overflow-hidden border-r border-l border-primary-500/10 sm:border-none -ml-1 lg:ml-0">
            <div
              ref={containerRef}
              className="flex space-x-6 py-1 no-scrollbar mt-2"
              style={{ width: "fit-content" }}
            >
              {renderItems()}
            </div>
          </div>
          <div className="w-2/3 h-24 hover:translate-x-1 duration-500 bg-primary-500/10 border border-primary-500/20 hidden lg:flex rounded-tr-ct items-center justify-center">
            <Image
              className="opacity-90"
              src="photos/zip_h.svg"
              alt="Zip Package"
              width={40}
              height={40}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
