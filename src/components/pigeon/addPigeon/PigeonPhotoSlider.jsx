import React, { useState, useRef, useEffect } from "react";
import { Plus, X, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import Image from "next/image";

const PigeonPhotosSlider = ({
  pigeonPhoto,
  setPigeonPhoto,
  eyePhoto,
  setEyePhoto,
  ownershipPhoto,
  setOwnershipPhoto,
  pedigreePhoto,
  setPedigreePhoto,
  DNAPhoto,
  setDNAPhoto,
  handleSpecificPhotoUpload,
  removeSpecificPhoto,
  getImageUrl,
}) => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Photo data array for easier mapping
  const photoData = [
    {
      photo: pigeonPhoto,
      setter: setPigeonPhoto,
      type: "pigeonPhoto",
      label: "Upload Pigeon Photo",
      alt: "Pigeon photo",
    },
    {
      photo: eyePhoto,
      setter: setEyePhoto,
      type: "eyePhoto",
      label: "Upload Eye Photo",
      alt: "Eye photo",
    },
    {
      photo: ownershipPhoto,
      setter: setOwnershipPhoto,
      type: "ownershipPhoto",
      label: "Upload Ownership Card",
      alt: "Ownership card",
    },
    {
      photo: pedigreePhoto,
      setter: setPedigreePhoto,
      type: "pedigreePhoto",
      label: "Upload Pedigree Photo/PDF",
      alt: "Pedigree photo",
    },
    {
      photo: DNAPhoto,
      setter: setDNAPhoto,
      type: "dnaPhoto",
      label: "Upload DNA Photo/PDF",
      alt: "DNA photo",
    },
  ];

  // Check scroll position
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Handle scroll navigation
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280; // Width of one item + gap
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  // Mouse drag functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Pigeon Photos</h2>
      <p className="text-xs text-destructive mb-4">
        Please upload images of your pigeon. Accepted formats: JPEG, PNG, JPG.
        Maximum file size: 10MB.
      </p>

      <div className="relative">
        {/* Left scroll button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            style={{ marginLeft: "-12px" }}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Right scroll button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            style={{ marginRight: "-12px" }}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide cursor-grab select-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex gap-4" style={{ width: "max-content" }}>
            {photoData.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-32">
                <div className="relative">
                  {item.photo ? (
                    <div className="relative aspect-square border-2 border-gray-200 rounded-lg overflow-hidden group flex flex-col items-center justify-center bg-gray-50">
                      {item.photo.isPdf ? (
                        <>
                          <div className="flex flex-col items-center justify-center p-3">
                            {/* PDF Icon */}
                            <FileText className="w-10 h-10 text-red-500 mb-2" />
                            {/* <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              className="w-10 h-10 text-red-500 mb-2"
                            >
                              <path d="M4 0h5.5L14 4.5V16H4V0zM9.5 1.5V5H13L9.5 1.5zM5 9v2h1V9H5zm2.5 0v2H9V9H7.5zM10 9v2h1V9h-1z" />
                            </svg> */}
                            {/* File name */}
                            <p className="text-xs text-gray-700 text-center break-words px-2">
                              {item.photo.file
                                ? item.photo.file.name
                                : "PDF File"}
                            </p>
                          </div>
                        </>
                      ) : (
                        <Image
                          src={
                            item.photo.file
                              ? item.photo.url
                              : getImageUrl(item.photo.url)
                          }
                          alt={item.alt}
                          width={128}
                          height={128}
                          className="h-20 w-20 xl:w-full xl:h-full object-cover pointer-events-none"
                          draggable={false}
                        />
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSpecificPhoto(item.setter, item.type);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-400 transition-colors bg-gray-50">
                      <input
                        type="file"
                        accept={
                          item.type === "pedigreePhoto" ||
                          item.type === "dnaPhoto"
                            ? "image/*,application/pdf"
                            : "image/*"
                        }
                        onChange={(e) =>
                          handleSpecificPhotoUpload(e, item.type, item.setter)
                        }
                        className="hidden"
                      />
                      <Plus className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500 text-center px-2">
                        {item.label}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PigeonPhotosSlider;
