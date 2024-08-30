import React, { useState, useEffect } from "react";
import {
  ClockIcon,
  PhoneIcon,
  ClipboardIcon,
  EnvelopeIcon,
  AtSymbolIcon,
  ArrowPathRoundedSquareIcon,
  SwatchIcon,
  MapPinIcon,
  ArrowDownTrayIcon,
  BookmarkIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Privacy from "../components/Privacy";
import Image from "next/image";

import { PiYoutubeLogo, PiLinkedinLogo, PiInstagramLogo } from "react-icons/pi";

const socials = {
  LinkedIn: "https://www.linkedin.com/company/weunzet",
  Instagram: "https://www.instagram.com/weunzet",
  Youtube: "https://www.youtube.com/@weunzet",
};

export default function Footer() {
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div id="footer">
      <div className="relative isolate z-10">
        <svg
          className="absolute top-24 sm:top-6 sm:-left-5 left-1/2 transform -translate-x-1/2 sm:translate-x-0 -z-10 sm:h-[16rem] h-[32rem] w-full stroke-primary-500/20 [mask-image:radial-gradient(32rem_8rem_at_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
              width={180}
              height={180}
              x="60%"
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
        <div className="relative pt-16 sm:pt-20 pb-16 overflow-hidden isolate">
          <div className="px-6 mx-auto max-w-7xl lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-10 max-w-7xl mx-auto gap-x-4">
              <div className="max-w-xl bg-secondary-400 text-white lg:max-w-md lg:col-span-2 border p-8 rounded-tr-ct rounded-bl-ct border-primary-500/20 duration-500 hover:-translate-y-1">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-3xl ">
                  Created With Love by The People at{" "}
                  <Link
                    href="https://unzet.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-primary-500 hover:underline">
                      Unzet
                    </span>
                  </Link>
                </h2>
              </div>

              <div className="relative grid grid-cols-1 text-lg gap-x-0 sm:grid-cols-1 lg:pt-2 lg:col-span-3 justify-start">
                <br className="sm:hidden"></br>
                <Card
                  title="Contact"
                  links={[
                    {
                      name: "we@unzet.com",
                      href: "mailto:we@unzet.com",
                      icon: EnvelopeIcon,
                    },
                    {
                      name: "+40 (750) 460 150",
                      href: "tel:+40750460150",
                      icon: PhoneIcon,
                    },
                    {
                      name: "9:00 to 18:00 GMT+2",
                      icon: ClockIcon,
                      "data-cal-namespace": "",
                      "data-cal-link": "weunzet/30min",
                      "data-cal-config": '{"layout":"month_view"}',
                      style: { cursor: "pointer" },
                    },
                    {
                      name: "Bucharest, Romania",
                      href: "https://www.google.com/maps/place/Unzet/@45.9159548,22.3813054,7z/data=!3m1!4b1!4m6!3m5!1s0xab831d8ce9074bd1:0x8e4e7886695442aa!8m2!3d45.9425072!4d25.0201084!16s%2Fg%2F11w1zh9zhq?entry=ttu",
                      icon: MapPinIcon,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    },
                  ]}
                  socials={socials}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-8 mx-auto shadow-lg max-w-7xl sm:pb-8 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 items-start gap-4 sm:py-0 -mt-8 sm:-mt-10">
            <div className="order-3 sm:order-1 pt-0 sm:pt-6 flex items-center sm:block -mb-8">
              <button
                className="text-md sm:text-sm leading-5 text-left text-white sm:mt-0 -ml-2 sm:ml-0 hover:scale-102 duration-500 hover:text-primary-500"
                onClick={() => (window.location.href = "https://unzet.com")}
              >
                Copyright &copy; {new Date().getFullYear()} Unzet
              </button>

              <button
                className="text-md sm:text-sm ml-5 sm:ml-0 text-white text-left hover:scale-102 transform duration-500 sm:hidden"
                type="button"
                onClick={handleOpenModal}
              >
                Privacy Policy
              </button>
            </div>

            <div className="order-1 sm:order-2 flex justify-start sm:justify-center pb-2 sm:pb-0 pt-10 sm:pt-6 -mt-16 sm:mt-0 invisible">
              <Link
                href="https://unzet.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/photos/unzet.svg"
                  alt="Member of Unzet"
                  width={280}
                  height={40}
                  className="sm:w-38 sm:h-4 w-56 h-8 -mt-2 sm:-mt-0 -mb-1 hover:scale-102 transform duration-500"
                />
              </Link>
            </div>

            <div className="order-3 flex flex-row justify-start sm:justify-end gap-4 pt-0 sm:pt-6">
              <button
                className="hidden text-md sm:text-sm text-white text-left hover:scale-102 transform duration-500 hover:text-primary-500"
                type="button"
              >
                Reset Consent
              </button>
              <button
                className="text-md sm:text-sm text-white text-left hover:scale-102 transform duration-500 hover:text-primary-500 invisible sm:visible"
                type="button"
                onClick={handleOpenModal}
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
        <Privacy show={isModalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  );
}

interface LinkProps {
  name: string;
  href?: string;
  icon: React.ElementType<React.SVGProps<SVGSVGElement>>;
  "data-cal-namespace"?: string;
  "data-cal-link"?: string;
  "data-cal-config"?: string;
  style?: React.CSSProperties;
  target?: string;
  rel?: string;
}

const Card: React.FC<{
  title: string;
  links: LinkProps[];
  socials?: { [key: string]: string };
}> = ({ title, links, socials }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, buttonRef]);

  return (
    <div className="text-white">
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 gap-x-0">
        {links.map((link, index) => (
          <li key={index} className="flex items-center">
            <Link
              href={link.href || ""}
              passHref
              target={link.target}
              rel={link.rel}
              className="block w-full"
            >
              <div
                onClick={(e) => {
                  if (!link.href) e.preventDefault();
                }}
                className="flex items-center leading-6 text-white transition-transform duration-500 text-md font-regular  hover:scale-102 hover:text-primary-500"
                {...(link.name === "9:00 to 18:00 GMT+2" && {
                  style: { cursor: "pointer" },
                })}
              >
                <link.icon
                  className="w-5 h-5 mr-2 text-primary-500 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="flex-grow">{link.name}</span>{" "}
                <ChevronRightIcon
                  className="w-5 h-5 flex-shrink-0 sm:invisible"
                  aria-hidden="true"
                />
              </div>
            </Link>
          </li>
        ))}
        {socials && (
          <li className="relative w-full">
            <button
              ref={buttonRef}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex justify-between items-center w-full  leading-6 text-white transition-transform duration-500 text-md font-regular hover:text-primary-500 hover:scale-102 rounded-md"
            >
              <div className="flex items-center">
                <AtSymbolIcon
                  className="w-5 h-5 mr-2 text-primary-500 flex-shrink-0"
                  aria-hidden="true"
                />
                <span>weunzet on socials</span>
              </div>
              <ChevronRightIcon
                className="w-5 h-5 flex-shrink-0 sm:invisible"
                aria-hidden="true"
              />
            </button>
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute z-10 px-4 pb-3 pt-2 text-white transition-transform duration-500 border shadow-lg bottom-8 bg-secondary-400 border-primary-500/20 rounded-tl-xl rounded-br-xl md:top-auto md:bottom-8"
              >
                <ul>
                  {Object.keys(socials).map((key, index) => (
                    <li key={index} className="mt-2">
                      <a
                        href={socials[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center leading-6 transition-transform duration-500 text-md font-regular hover:text-primary-500 hover:scale-102"
                      >
                        {key === "LinkedIn" && (
                          <PiLinkedinLogo
                            size={20}
                            className="w-5 h-5 text-primary-500 mr-2"
                            aria-hidden="true"
                          />
                        )}
                        {key === "Instagram" && (
                          <PiInstagramLogo
                            className="w-5 h-5 text-primary-500 mr-2"
                            aria-hidden="true"
                          />
                        )}
                        {key === "Youtube" && (
                          <PiYoutubeLogo
                            className="w-5 h-5 text-primary-500 mr-2"
                            aria-hidden="true"
                          />
                        )}
                        <span>{key}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        )}
      </ul>
    </div>
  );
};
