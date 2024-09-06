"use client";

import UploadForm from "./components/UploadForm";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "90vh" }}
    >
      <Navbar />
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%" }}>
          <UploadForm />
        </div>
      </div>
    </div>
  );
}
