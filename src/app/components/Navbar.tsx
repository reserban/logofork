import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
  DragEvent,
  RefObject,
} from "react";
import {
  Bars3Icon,
  XMarkIcon,
  ChatBubbleBottomCenterTextIcon,
  SwatchIcon,
  ArrowPathRoundedSquareIcon,
  ClipboardIcon,
  BookmarkIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

import Link from "next/link";
import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import introJs from "intro.js";
import "intro.js/introjs.css";

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type NavbarProps = {
  setShowUploadForm: (show: boolean) => void;
  showUploadForm: boolean;
};

const startIntroJs = (showUploadForm: boolean) => {
  const intro = introJs();
  const steps = [
    {
      element: "#tutorial-start",
      intro:
        "Welcome to the Logo Packer! You can skip this tutorial if you wish.",
    },
    {
      element: "#vertical-logo-drop-zone",
      intro: "Drag and drop, upload or paste the logos you need.",
    },
    {
      element: "#archive-option",
      intro: "Or select an archive.",
    },
    {
      element: "#filter-icon",
      intro: "You can select what you need.",
    },
  ];

  if (showUploadForm) {
    steps.push(
      {
        element: "#package-name",
        intro: "You can change the company name here.",
      },
      {
        element: "#color-picker",
        intro: "This is the background color for JPG and favicons.",
      },
      {
        element: "#generate-button",
        intro: "Click here to generate your logo package. Enjoy!",
      }
    );
  }

  intro.setOptions({
    steps,
    tooltipClass: "customTooltip",
    showButtons: false,
  });

  intro.oncomplete(() => {
    localStorage.setItem("tutorialSkipped", "true");
  });

  intro.onexit(() => {
    localStorage.setItem("tutorialSkipped", "true");
  });

  intro.start();
};

export default function Navbar({
  setShowUploadForm,
  showUploadForm,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [tutorialShown, setTutorialShown] = useState(false);

  useEffect(() => {
    const tutorialSkipped = localStorage.getItem("tutorialSkipped");
    if (!tutorialSkipped && showUploadForm && !tutorialShown) {
      startIntroJs(showUploadForm);
      setTutorialShown(true);
    }
  }, [showUploadForm, tutorialShown]);

  useEffect(() => {
    if (Object.values(files).some((file) => file !== null)) {
      startIntroJs(showUploadForm);
    }
  }, [files, showUploadForm]);

  const navigation = [
    { name: "The Lab", href: "#products", icon: SwatchIcon },
    { name: "Process", href: "#how", icon: ArrowPathRoundedSquareIcon },
    { name: "Values", href: "#values", icon: SquaresPlusIcon },
    { name: "Tools", href: "#tools", icon: ClipboardIcon },
    { name: "About", href: "#founder", icon: BookmarkIcon },
  ];

  const SHOW_NAV_ITEMS = true;

  const UnzetButton = () => (
    <button
      onClick={() => window.open("https://unzet.com", "_blank")}
      className="rounded-tr-xl rounded-bl-xl border-1 border border-white/80 text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-500 transform transition-transform duration-500 hover:scale-105 flex items-center"
    >
      <span className="pr-2">
        <span className="relative flex w-2 h-2">
          <span className="absolute inline-flex w-full h-full bg-white opacity-100 animate-ping"></span>
          <span className="relative inline-flex w-2 h-2 pb-1 bg-white "></span>
        </span>
      </span>{" "}
      Unzet
    </button>
  );

  return (
    <motion.header
      className="rounded-br-ct z-50 relative mb-6 sm:bg-none"
      animate={{ backgroundColor: mobileMenuOpen ? "black" : "transparent" }}
      transition={{ duration: 0.2 }}
    >
      <nav
        className="flex items-center justify-between p-6 mx-auto max-w-7xl lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/">
            <Image
              onClick={() => setShowUploadForm(false)}
              className="w-36 h-auto transition-transform duration-500 transform hover:scale-105 cursor-pointer"
              src="/photos/logo.svg"
              alt="Unzet Logo"
              width={128}
              height={32}
            />
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:items-center">
          <span className="text-white/60 mt-1 text-sm">
            Packer Public Beta v2.0.1
          </span>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-3 ">
          <AnimatePresence>
            {showUploadForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <ChatBubbleBottomCenterTextIcon
                  id="tutorial-start"
                  className="mr-0.5 w-5 h-5 mt-0.5 text-white cursor-pointer hover:text-primary-500 hover:scale-105 duration-500"
                  onClick={() => startIntroJs(showUploadForm)}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
      <AnimatePresence>
        {mobileMenuOpen && SHOW_NAV_ITEMS && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-40 w-full px-4 py-6 -mt-2 pb-5 bg-black border-b sm:border-l border-primary-500/20 lg:hidden sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 rounded-br-ct sm:rounded-bl-ct sm:rounded-br-none"
          >
            <div className="flex flex-col items-start space-y-4">
              <div className="flex w-full justify-between items-center gap-4 pl-2">
                <UnzetButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
