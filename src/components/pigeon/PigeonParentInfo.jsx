"use client";

import React from "react";

const PigeonParentInfo = ({
  register,
  fatherSearchTerm,
  setFatherSearchTerm,
  motherSearchTerm,
  setMotherSearchTerm,
  selectedFatherId,
  setSelectedFatherId,
  selectedMotherId,
  setSelectedMotherId,
  fatherRingNumber,
  setFatherRingNumber,
  motherRingNumber,
  setMotherRingNumber,
  selectedFather,
  setSelectedFather,
  selectedMother,
  setSelectedMother,
  fatherList,
  motherList
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-10">
        {/* Father Ring ID */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Father Ring ID
          </label>
          
          <div>
            <input
              type="text"
              {...register("fatherRingId")}
              value={
                selectedFatherId
                  ? fatherList.find((f) => f._id === selectedFatherId)
                      ?.ringNumber || fatherRingNumber
                  : fatherSearchTerm
              }
              onChange={(e) => {
                setFatherSearchTerm(e.target.value);
                setSelectedFatherId(""); // reset selection if user types
                setFatherRingNumber(""); // clear stored ring number
              }}
              placeholder="Search father ring number or name"
              className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <p className="text-xs text-destructive mt-1">
              Enter a part of the ring or part of the name to search for
              the corresponding Pigeon
            </p>

            {/* Dropdown list */}
            {fatherList?.length > 0 &&
              !selectedFatherId &&
              fatherSearchTerm && (
                <ul className="border border-gray-300 rounded mt-1 max-h-40 overflow-auto bg-white z-10 absolute max-w-[410px]">
                  {fatherList.map((pigeon) => (
                    <li
                      key={pigeon._id}
                      className="px-3 py-[14px] hover:bg-teal-100 cursor-pointer"
                      onClick={() => {
                        setSelectedFatherId(pigeon.ringNumber);
                        setFatherSearchTerm(pigeon.ringNumber);
                        setFatherRingNumber(pigeon.ringNumber);
                        setSelectedFather(pigeon); // store full selected pigeon info
                      }}
                    >
                      {pigeon.ringNumber} - {pigeon.name}
                    </li>
                  ))}
                </ul>
              )}

            {/* Selected pigeon info */}
            {selectedFatherId && selectedFather && (
              <div className="mt-2 p-2 border border-gray-200 rounded bg-gray-50">
                <p className="text-sm">
                  <span className="font-medium">Ring:</span>{" "}
                  {selectedFather.ringNumber}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Name:</span>{" "}
                  {selectedFather.name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mother Ring ID */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mother Ring ID
          </label>

          <div>
            <input
              type="text"
              {...register("motherRingId")}
              value={
                selectedMotherId
                  ? motherList.find((m) => m._id === selectedMotherId)
                      ?.ringNumber || motherRingNumber
                  : motherSearchTerm
              }
              onChange={(e) => {
                setMotherSearchTerm(e.target.value);
                setSelectedMotherId(""); // reset selection if user types
                setMotherRingNumber(""); // clear stored ring number
              }}
              placeholder="Search mother ring number or name"
              className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <p className="text-xs text-destructive mt-1">
              Enter a part of the ring or part of the name to search for
              the corresponding Pigeon
            </p>

            {/* Dropdown list */}
            {motherList?.length > 0 &&
              !selectedMotherId &&
              motherSearchTerm && (
                <ul className="border border-gray-300 rounded mt-1 max-h-40 overflow-auto bg-white z-10 absolute max-w-[410px]">
                  {motherList.map((pigeon) => (
                    <li
                      key={pigeon._id}
                      className="px-3 py-[14px] hover:bg-teal-100 cursor-pointer"
                      onClick={() => {
                        setSelectedMotherId(pigeon.ringNumber);
                        setMotherSearchTerm(pigeon.ringNumber);
                        setMotherRingNumber(pigeon.ringNumber);
                        setSelectedMother(pigeon);
                      }}
                    >
                      {pigeon.ringNumber} - {pigeon.name}
                    </li>
                  ))}
                </ul>
              )}

            {/* Selected pigeon info */}
            {selectedMotherId && selectedMother && (
              <div className="mt-2 p-2 border border-gray-200 rounded bg-gray-50">
                <p className="text-sm">
                  <span className="font-medium">Ring:</span>{" "}
                  {selectedMother.ringNumber}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Name:</span>{" "}
                  {selectedMother.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PigeonParentInfo;