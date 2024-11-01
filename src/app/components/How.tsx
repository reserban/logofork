import React, { useState } from "react";
import Image from "next/image";
import {
  DocumentArrowUpIcon,
  WalletIcon,
  ChevronRightIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function How() {
  const [isMobileVideoPlaying, setIsMobileVideoPlaying] = useState(false);
  const [isDesktopVideoPlaying, setIsDesktopVideoPlaying] = useState(false);

  const MobileVideoContainer = () => (
    <div className="relative w-full aspect-video rounded-cts border border-primary-500/20 overflow-hidden">
      {!isMobileVideoPlaying ? (
        <>
          <Image
            src="/photos/videothumbnail.webp"
            alt="Video thumbnail"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-cts opacity-80 object-cover"
          />
          <button
            onClick={() => setIsMobileVideoPlaying(true)}
            className="absolute inset-0 flex items-center justify-center group"
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 164 115"
              className=" duration-500 group-hover:text-red-600 group-hover:scale-105 text-secondary-300 opacity-80"
            >
              <g transform="matrix(1,0,0,1,-519.516,146.481)">
                <g transform="matrix(5.71504,0,0,5.71504,2858.62,1441.08)">
                  <path
                    d="M-381.316,-274.664C-381.645,-275.894 -382.612,-276.86 -383.842,-277.19C-386.069,-277.787 -395.004,-277.787 -395.004,-277.787C-395.004,-277.787 -403.939,-277.787 -406.166,-277.19C-407.396,-276.86 -408.362,-275.894 -408.692,-274.664C-409.289,-272.437 -409.289,-267.787 -409.289,-267.787C-409.289,-267.787 -409.289,-263.137 -408.692,-260.91C-408.362,-259.68 -407.396,-258.714 -406.166,-258.384C-403.939,-257.787 -395.004,-257.787 -395.004,-257.787C-395.004,-257.787 -386.069,-257.787 -383.842,-258.384C-382.612,-258.714 -381.645,-259.68 -381.316,-260.91C-380.719,-263.137 -380.719,-267.787 -380.719,-267.787C-380.719,-267.787 -380.721,-272.437 -381.316,-274.664Z"
                    style={{
                      fill: "currentColor",
                      fillRule: "nonzero",
                    }}
                  />
                  <path
                    d="M-397.864,-263.502L-390.441,-267.787L-397.864,-272.072L-397.864,-263.502Z"
                    style={{ fill: "white", fillRule: "nonzero" }}
                  />
                </g>
              </g>
            </svg>
          </button>
        </>
      ) : (
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-cts opacity-80"
          src="https://www.youtube.com/embed/-H7w9wNTcvo?autoplay=1"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );

  return (
    <>
      <section id="how">
        <div className="relative px-6 pt-6 lg:pt-20 pb-6 sm:pb-20 overflow-hidden isolate sm:py-20 lg:overflow-visible lg:px-0">
          <div className="absolute inset-0 overflow-hidden -z-10"></div>

          <div className="lg:hidden mb-12 max-w-2xl mx-auto">
            <MobileVideoContainer />
          </div>

          <div className="grid max-w-2xl sm:max-w-4xl grid-cols-1 mx-auto gap-x-14 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-8">
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
              <div className="lg:pr-4">
                <div className="max-w-2xl sm:max-w-5xl lg:max-w-xl mx-auto lg:mx-0 mr-1 sm:text-center lg:text-left">
                  <h2 className="text-3xl font-bold tracking-tight text-primary-500 sm:text-4xl">
                    Pack Pack Pack
                  </h2>
                  <p className="mt-6 text-xl max-w-2xl leading-7 text-white sm:mx-auto lg:mx-0">
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
                <div className="max-w-2xl text-lg leading-7 text-white lg:max-w-xl sm:mx-auto lg:mx-0 sm:text-center lg:text-left">
                  <ul role="list" className="space-y-8 text-white text-xl">
                    <li className="flex gap-x-3 sm:justify-center lg:justify-start">
                      <WalletIcon
                        className="flex-none w-5 h-5 mt-1 text-primary-500"
                        aria-hidden="true"
                      />
                      <span>
                        Logofork works with whatever you are using, be it
                        Illustrator, Affinity Designer, or Inkscape. It&apos;s
                        designed to support you across different platforms.
                      </span>
                    </li>
                    <li className="flex gap-x-3 sm:justify-center lg:justify-start">
                      <DocumentArrowUpIcon
                        className="flex-none w-5 h-5 mt-1 text-primary-500"
                        aria-hidden="true"
                      />
                      <span id="how1">
                        Why fewer options than other similar softwares? I
                        believe more options can confuse users. That&apos;s why
                        we keep Logofork simple and consistent for everyone.
                      </span>
                    </li>
                  </ul>
                  <i>
                    <p className="mt-6 font-light text-xl opacity-60">
                      Alexandru Serban - Founder @ Unzet
                    </p>
                  </i>
                  <h2 className="mt-10 text-2xl font-bold tracking-tight text-primary-500">
                    Your support is important
                  </h2>
                  <p className="mt-6 text-xl leading-7 text-white">
                    Logofork isn&apos;t perfect, but it&apos;s a powerful tool.
                    We&apos;re here to improve it and make it the best it can
                    be.
                  </p>
                  <p className="mt-6 text-xl leading-7 text-white" id="how2">
                    This is where you come in. Support Logofork by giving
                    feedback, donating to keep it running, or simply spreading
                    the word. Your support motivates us to keep going.
                  </p>
                </div>
                <div className="flex items-center mt-10 gap-x-6 sm:justify-center lg:justify-start">
                  <Link
                    data-umami-event="join discord"
                    href="https://discord.gg/W3ukzkXe2y"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer rounded-bl-xl rounded-tr-xl bg-primary-500 px-3.5 py-2.5 text-sm font-bold text-secondary-400 shadow-sm hover:bg-primary-500/5 hover:border-primary-500/60 hover:text-primary-500 border-primary-500/20 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transform transition-transform duration-500 hover:scale-105"
                  >
                    Join Discord
                  </Link>
                  <Link
                    data-umami-event="support us"
                    href="https://buymeacoffee.com/theserban"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex text-sm font-semibold leading-6 text-white transition-all duration-500 transform gap-x-0.5 hover:gap-x-1 hover:scale-105 hover:text-primary-500 cursor-pointer"
                  >
                    Support Us
                    <ChevronRightIcon className="w-4 mt-1 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden lg:inline pt-5 mt-0 pl-12 md:pl-1 md:pt-12 lg:pl-5 pr-12 sm:-mt-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 duration-500 hover:-translate-y-1 lg:overflow-hidden">
              <div className="mt-6 relative w-[560px] h-[315px]  rounded-cts border border-primary-500/20 overflow-hidden ">
                {!isDesktopVideoPlaying ? (
                  <>
                    <Image
                      src="/photos/videothumbnail.webp"
                      alt="Video thumbnail"
                      fill
                      sizes="560px"
                      className="rounded-cts opacity-80 object-cover"
                    />
                    <button
                      onClick={() => setIsDesktopVideoPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center group"
                    >
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 164 115"
                        className=" duration-500 group-hover:text-red-600 group-hover:scale-105 text-secondary-300 opacity-80"
                      >
                        <g transform="matrix(1,0,0,1,-519.516,146.481)">
                          <g transform="matrix(5.71504,0,0,5.71504,2858.62,1441.08)">
                            <path
                              d="M-381.316,-274.664C-381.645,-275.894 -382.612,-276.86 -383.842,-277.19C-386.069,-277.787 -395.004,-277.787 -395.004,-277.787C-395.004,-277.787 -403.939,-277.787 -406.166,-277.19C-407.396,-276.86 -408.362,-275.894 -408.692,-274.664C-409.289,-272.437 -409.289,-267.787 -409.289,-267.787C-409.289,-267.787 -409.289,-263.137 -408.692,-260.91C-408.362,-259.68 -407.396,-258.714 -406.166,-258.384C-403.939,-257.787 -395.004,-257.787 -395.004,-257.787C-395.004,-257.787 -386.069,-257.787 -383.842,-258.384C-382.612,-258.714 -381.645,-259.68 -381.316,-260.91C-380.719,-263.137 -380.719,-267.787 -380.719,-267.787C-380.719,-267.787 -380.721,-272.437 -381.316,-274.664Z"
                              style={{
                                fill: "currentColor",
                                fillRule: "nonzero",
                              }}
                            />
                            <path
                              d="M-397.864,-263.502L-390.441,-267.787L-397.864,-272.072L-397.864,-263.502Z"
                              style={{ fill: "white", fillRule: "nonzero" }}
                            />
                          </g>
                        </g>
                      </svg>
                    </button>
                  </>
                ) : (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-cts opacity-80"
                    src="https://www.youtube.com/embed/-H7w9wNTcvo?autoplay=1"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
