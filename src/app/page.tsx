"use client";

import UploadForm from "./components/UploadForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <UploadForm />
      <Footer />
    </div>
  );
}
