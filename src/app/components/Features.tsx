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
    <div className="relative isolate ">
      <div className="relative overflow-hidden">
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
