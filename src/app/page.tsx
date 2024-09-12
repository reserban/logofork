"use client";

import { useState, useEffect } from "react";
import UploadForm from "./components/UploadForm";
import Hero from "./components/Hero";
import How from "./components/How";
import Formats from "./components/Formats";
import Features from "./components/Features";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundaries";

export default function Home() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showHeroGroup, setShowHeroGroup] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    try {
      const hasStarted = localStorage.getItem("hasStarted");
      if (hasStarted) {
        setShowUploadForm(true);
        setShowHeroGroup(false);
      }
    } catch (error) {
      console.error("Error accessing localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (showUploadForm) {
      localStorage.setItem("hasStarted", "true");
      setShowHeroGroup(false);
    } else {
      setShowHeroGroup(true);
    }
  }, [showUploadForm]);

  useEffect(() => {
    try {
      setIsMobile(window.innerWidth <= 768);
    } catch (error) {
      console.error("Error accessing window object", error);
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ErrorBoundary>
      <div className="bg-black relative">
        <div className="fixed w-full h-full" style={{ overflow: "hidden" }}>
          <svg
            className="absolute mt-1 stroke-primary-500/20 [mask-image:radial-gradient(52rem_32rem_at_center,white,transparent)]"
            aria-hidden="true"
            style={{
              width: "100%",
              height: "100%",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: "8124px",
              minHeight: "100%",
            }}
          >
            <defs>
              <pattern
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={180}
                height={180}
                x="100"
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
        </div>
        <Navbar
          showUploadForm={showUploadForm}
          setShowUploadForm={setShowUploadForm}
        />
        <div
          aria-hidden="true"
          className="fixed inset-x-0 -top-40 z-0 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#edff00] to-[#000] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div
          aria-hidden="true"
          className="fixed inset-x-0 top-[calc(100%-20rem)] z-0 -mt-96 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-37rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#edff00] to-[#000] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] z-0 "
          />
        </div>
        <div className="relative z-10">
          <div className="fixed-height">
            {showUploadForm && (
              <div>
                <UploadForm />
              </div>
            )}
          </div>
        </div>
        {!showUploadForm && showHeroGroup && (
          <div key="heroGroup" className="relative z-10">
            <Hero setShowUploadForm={setShowUploadForm} />
            <Formats />
            <How />
            <Features />
            <Footer />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
