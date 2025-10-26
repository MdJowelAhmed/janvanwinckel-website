"use client";

import React from "react";

export const Spinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${spinnerSize} border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export const ButtonSpinner = ({ className = "" }) => {
  return (
    <div className={`inline-block ${className}`}>
      <Spinner size="sm" />
    </div>
  );
};

export const FullPageSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <Spinner size="xl" className="text-primary" />
    </div>
  );
};

export default Spinner;