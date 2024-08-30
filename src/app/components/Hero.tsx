import React from "react";
import UploadForm from "./UploadForm";

export default function Hero() {
  return (
    <div className="bg-black flex flex-col items-center justify-center">
      <div className="relative isolate flex-grow flex items-center justify-center w-full">
        <svg
          className="absolute top-24 sm:-left-0 left-1/2 transform -translate-x-1/2 sm:translate-x-0 -z-10 sm:h-[32rem] h-[32rem] w-full stroke-primary-500/20 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
              width={180}
              height={180}
              x="100%"
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
        <div className=" w-full">
          <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
            <div className="mx-auto max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                10 Seconds{" "}
                <span className="text-primary-500">Logo Package</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-white pb-6">
                Don&apos;t waste time on packaging the great designs you create.
                Drag and Drop, Upload or Paste your SVGs and get it done.
              </p>
            </div>
            <UploadForm />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        ></div>
      </div>
    </div>
  );
}
