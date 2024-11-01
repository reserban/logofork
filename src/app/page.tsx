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
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ErrorBoundary>
      <div className="bg-secondary-500 relative">
        <div
          className="fixed w-full h-full"
          style={{ overflow: "hidden" }}
        ></div>
        <Navbar
          showUploadForm={showUploadForm}
          setShowUploadForm={setShowUploadForm}
        />
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

            <Features />
            <Footer />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
