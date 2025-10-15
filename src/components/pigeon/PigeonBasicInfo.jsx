"use client";

import React from "react";
import { getNames } from "country-list";

const PigeonBasicInfo = ({ 
  register, 
  errors, 
  colorPatternMap, 
  selectedColor, 
  setSelectedColor, 
  selectedPattern, 
  setSelectedPattern, 
  showPatterns, 
  setShowPatterns, 
  colorDropdownOpen, 
  setColorDropdownOpen,
  currentYear,
  futureYear
}) => {
  const countries = getNames();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-10">
        {/* Ring Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ring Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("ringNumber", { required: true })}
            placeholder="Enter ring number"
            className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.ringNumber && (
            <p className="text-red-500 text-xs mt-1">Ring number is required</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="Enter pigeon name"
            className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            {...register("country")}
            defaultValue=""
            className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="" disabled>
              Select Country
            </option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Birth Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birth Year
          </label>
          <select
            {...register("birthYear")}
            defaultValue=""
            className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="" disabled>
              Select Birth Year
            </option>
            {Array.from(
              { length: futureYear - 1990 + 1 },
              (_, i) => futureYear - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            {...register("gender")}
            defaultValue=""
            className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Cock">Cock</option>
            <option value="Hen">Hen</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            {...register("status")}
            defaultValue=""
            className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Sold">Sold</option>
            <option value="Dead">Dead</option>
          </select>
        </div>

        {/* Color */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <div className="relative">
            <div
              className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 flex justify-between items-center cursor-pointer"
              onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
            >
              <span className="text-gray-500">
                {selectedColor
                  ? `${selectedColor}${
                      selectedPattern ? ` - ${selectedPattern}` : ""
                    }`
                  : "Select Color"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${
                  colorDropdownOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {colorDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                {!showPatterns ? (
                  <div className="max-h-60 overflow-auto">
                    {Object.keys(colorPatternMap).map((color) => (
                      <div
                        key={color}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedColor(color);
                          setShowPatterns(true);
                        }}
                      >
                        {color.replace("_", " ")}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="max-h-60 overflow-auto">
                    <div
                      className="px-3 py-2 text-teal-600 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => setShowPatterns(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back to Colors
                    </div>
                    {colorPatternMap[selectedColor].map((pattern) => (
                      <div
                        key={pattern}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedPattern(pattern);
                          setColorDropdownOpen(false);
                          setShowPatterns(false);
                        }}
                      >
                        {pattern}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <input
            type="hidden"
            {...register("color")}
            value={`${selectedColor ? selectedColor.replace("_", " ") : ""}${
              selectedPattern ? ` ${selectedPattern}` : ""
            }`}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            {...register("location")}
            placeholder="Enter location"
            className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Breeder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Breeder
          </label>
          <div className="relative">
            <input
              type="text"
              {...register("breederInput")}
              placeholder="Type or select breeder name"
              className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              list="breederOptions"
            />
            <datalist id="breederOptions">
              {/* Breeder options will be populated from props */}
            </datalist>
          </div>
        </div>

        {/* Breeder Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Breeder Rating
          </label>
          <select
            {...register("breederRating")}
            defaultValue=""
            placeholder="Select Breeder Rating"
            className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="" disabled>
              Select Breeder Rating
            </option>
            {Array.from({ length: 100 }, (_, i) => i + 1)
              .reverse()
              .map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
          </select>
        </div>

        {/* Racing Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Racing Rating
          </label>
          <select
            {...register("racingRating")}
            defaultValue=""
            className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="" disabled>
              Select Racing Rating
            </option>
            {Array.from({ length: 100 }, (_, i) => i + 1)
              .reverse()
              .map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
          </select>
        </div>

        {/* Racher Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Racher Rating
          </label>
          <select
            {...register("racherRating")}
            defaultValue=""
            className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="" disabled>
              Select Racher Rating
            </option>
            {Array.from({ length: 100 }, (_, i) => i + 1)
              .reverse()
              .map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Info
        </label>
        <textarea
          {...register("shortInfo")}
          placeholder="Enter short information about the pigeon"
          rows={3}
          className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          {...register("notes")}
          placeholder="Additional notes about the pigeon"
          rows={3}
          className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        />
      </div>
    </div>
  );
};

export default PigeonBasicInfo;