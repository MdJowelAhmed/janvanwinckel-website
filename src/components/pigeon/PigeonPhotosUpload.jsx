"use client";

import React from "react";
import PigeonPhotosSlider from "./addPigeon/PigeonPhotoSlider";

const PigeonPhotosUpload = ({
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
  register,
  raceResults,
  setRaceResults,
  showPigeonResult,
  setShowPigeonResult
}) => {
  const addRaceResult = () => {
    setRaceResults([
      ...raceResults,
      { name: "", date: "", distance: "", total: "", place: "" },
    ]);
  };

  const removeRaceResult = (index) => {
    const updatedResults = [...raceResults];
    updatedResults.splice(index, 1);
    setRaceResults(updatedResults);
  };

  const handleRaceResultChange = (index, field, value) => {
    const updatedResults = [...raceResults];
    updatedResults[index][field] = value;
    setRaceResults(updatedResults);
  };

  return (
    <div className="bg-white rounded-lg lg:col-span-2 p-6 shadow-sm">
      <PigeonPhotosSlider
        pigeonPhoto={pigeonPhoto}
        setPigeonPhoto={setPigeonPhoto}
        eyePhoto={eyePhoto}
        setEyePhoto={setEyePhoto}
        ownershipPhoto={ownershipPhoto}
        setOwnershipPhoto={setOwnershipPhoto}
        pedigreePhoto={pedigreePhoto}
        setPedigreePhoto={setPedigreePhoto}
        DNAPhoto={DNAPhoto}
        setDNAPhoto={setDNAPhoto}
        handleSpecificPhotoUpload={handleSpecificPhotoUpload}
        removeSpecificPhoto={removeSpecificPhoto}
        getImageUrl={getImageUrl}
      />

      <div className="mt-10">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Race result
        </label>
        <textarea
          {...register("addresults")}
          placeholder="Enter race results"
          rows={3}
          className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Add Race Results</h3>
          <div className="flex items-center">
            <div className="mr-4">
              <input
                type="checkbox"
                id="showPigeonResult"
                checked={showPigeonResult}
                onChange={(e) => setShowPigeonResult(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showPigeonResult">Add Race Results</label>
            </div>
            {showPigeonResult && (
              <button
                type="button"
                onClick={addRaceResult}
                className="flex items-center text-teal-600 hover:text-teal-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Result
              </button>
            )}
          </div>
        </div>

        {showPigeonResult && (
          <div className="space-y-4">
            {raceResults.map((result, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Race Result #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeRaceResult(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Race Name
                    </label>
                    <input
                      type="text"
                      value={result.name}
                      onChange={(e) =>
                        handleRaceResultChange(index, "name", e.target.value)
                      }
                      placeholder="Enter race name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={result.date}
                      onChange={(e) =>
                        handleRaceResultChange(index, "date", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distance (km)
                    </label>
                    <input
                      type="text"
                      value={result.distance}
                      onChange={(e) =>
                        handleRaceResultChange(
                          index,
                          "distance",
                          e.target.value
                        )
                      }
                      placeholder="Enter distance"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Pigeons
                    </label>
                    <input
                      type="number"
                      value={result.total}
                      onChange={(e) =>
                        handleRaceResultChange(index, "total", e.target.value)
                      }
                      placeholder="Enter total pigeons"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Place
                    </label>
                    <input
                      type="text"
                      value={result.place}
                      onChange={(e) =>
                        handleRaceResultChange(index, "place", e.target.value)
                      }
                      placeholder="Enter place"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center space-x-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="verified"
            {...register("verified")}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label
            htmlFor="verified"
            className="ml-2 block text-sm text-gray-700"
          >
            Verified
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="iconic"
            {...register("iconic")}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label
            htmlFor="iconic"
            className="ml-2 block text-sm text-gray-700"
          >
            Iconic
          </label>
        </div>
      </div>

      {/* Iconic Score */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Iconic Score
        </label>
        <select
          {...register("iconicScore")}
          defaultValue=""
          className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="" disabled>
            Select Iconic Score
          </option>
          {Array.from({ length: 100 }, (_, i) => i + 1)
            .reverse()
            .map((score) => (
              <option key={score} value={score}>
                {score}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default PigeonPhotosUpload;