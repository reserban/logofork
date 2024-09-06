import React from "react";
import UploadForm from "./UploadForm";
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

export default function Hero() {
  return (
    <div className="bg-black flex flex-col items-center justify-center p-4 sm:p-0">
      <div className="relative isolate flex-grow flex items-center justify-center w-full">
        <div className="w-full">
          <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
            <div className="mx-auto max-w-2xl">
              <h1 className="text-4xl mb-7 mt-4 font-bold tracking-tight text-white sm:text-6xl">
                <span className="block sm:hidden mt-32 text-center font-semibold text-3xl">
                  <ComputerDesktopIcon className="h-20 w-20 text-primary-500 mb-6 mx-auto" />
                  Packer is only available{" "}
                  <span className="text-primary-500">on desktop</span> at the
                  moment.
                </span>
                <span className="hidden sm:inline">
                  10 Seconds{" "}
                  <span className="text-primary-500">Logo Package</span>
                </span>
              </h1>
            </div>
            <div className="hidden sm:block">
              <UploadForm />
            </div>
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
