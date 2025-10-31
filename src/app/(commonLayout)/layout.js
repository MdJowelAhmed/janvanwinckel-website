"use client"
import React, { useState } from "react";
import Footer from "@/components/footer/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import Navbar from "@/components/navbar/Navbar";

const CommonLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fff] relative">
      {/* Overlay when loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center cursor-not-allowed">
          <div className="text-white text-lg font-medium animate-pulse">
            Loading...
          </div>
        </div>
      )}

      {/* Header */}
      <LayoutWrapper>
        <Navbar />
        {/* Main content */}
        <div className="bg-[#fff] flex flex-col flex-grow">
          <main className="container mx-auto mt-20 flex-1 relative">
            {/* Disable clicks when loading */}
            <div className={`${isLoading ? "pointer-events-none opacity-50" : ""}`}>
              {children}
            </div>
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </LayoutWrapper>
    </div>
  );
};

export default CommonLayout;
