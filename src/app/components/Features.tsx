import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  FingerPrintIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Features() {
  return (
    <div className="relative -mt-3 -mb-20 sm:mt-0 sm:-mb-6 isolate py-24 sm:py-12">
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <p className="text-3xl font-bold tracking-tight text-primary-500 sm:text-4xl">
            From Packer to Client
          </p>
          <p className="mt-6 text-xl leading-8 text-white">
            Packer uses industry standards to meet any project&apos;s needs.
            Simply take the zip file you get and send it directly to your
            client.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
            <Image
              alt="App screenshot 1"
              src="/photos/feature1.webp"
              width={600}
              height={400}
              className="col-span-1 row-span-1 rounded-tl-ct rounded-br-ct sm:rounded-br-none shadow-2xl border border-primary-500/20 opacity-80 hover:-translate-y-1 duration-500"
            />
            <Image
              alt="App screenshot 2"
              src="/photos/feature2.webp"
              width={600}
              height={400}
              className="col-span-1 row-span-1 rounded-tr-ct rounded-bl-ct sm:rounded-bl-none shadow-2xl border border-primary-500/20 opacity-80 hover:-translate-y-1 duration-500"
            />
            <Image
              alt="App screenshot 3"
              src="/photos/feature3.webp"
              width={1400}
              height={400}
              className="col-span-1 hidden sm:inline sm:col-span-2 row-span-1 rounded-tl-ct sm:rounded-tl-none border border-primary-500/20 rounded-bl-none sm:rounded-bl-ct rounded-br-ct shadow-2xl opacity-80 hover:-translate-y-1 duration-500"
            />{" "}
            <Image
              alt="App screenshot 3"
              src="/photos/feature3_mobile.webp"
              width={1400}
              height={400}
              className="sm:hidden col-span-1 sm:col-span-2 row-span-1 rounded-tl-ct sm:rounded-tl-none border border-primary-500/20 rounded-bl-none sm:rounded-bl-ct rounded-br-ct shadow-2xl opacity-80 hover:-translate-y-1 duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
