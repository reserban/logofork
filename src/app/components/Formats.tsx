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
        currentPosition -= totalWidth;
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
        className="flex-shrink-0 text-center transition-transform transform px-6 py-3 tool-item rounded-xl bg-secondary-400  border"
      >
        <div className="h-6 flex items-center justify-center mb-1 mt-1">
          <label className="flex items-center">
            <span className="w-5 h-5 inline-block mr-2 rounded  bg-primary-500">
              <svg
                className="w-4 h-4 text-secondary-400 pt-0.5"
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
          <span className="text-xl ml-0.5 font-medium text-white">
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
          <div className="absolute left-7 lg:left-8 top-0 bottom-10 w-16 bg-gradient-to-r from-background to-transparent z-10 border-l border-secondary-400/20"></div>

          <div className="overflow-hidden border-l border-r border-primary-500/10 sm:border-none -ml-1 lg:ml-0">
            <div
              ref={containerRef}
              className="flex space-x-6 py-1 no-scrollbar mt-2 opacity-90"
              style={{ width: "fit-content" }}
            >
              {renderItems()}
            </div>
          </div>

          <div className="absolute right-7 lg:right-8 top-0 bottom-10 w-16 bg-gradient-to-l from-background to-transparent z-10 border-r border-secondary-400/20"></div>
        </div>
      </div>
    </section>
  );
}
