"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, X, Upload, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  useCreatePigeonMutation,
  useUpdatePigeonMutation,
  useGetPigeonPackagesQuery,
  useGetSinglePigeonQuery,
} from "@/redux/featured/pigeon/pigeonApi";
import { useGetBreederQuery } from "@/redux/featured/pigeon/breederApi";
import Image from "next/image";
import { getImageUrl } from "../share/imageUrl";
import { getNames } from "country-list";

const AddPigeonContainer = ({ pigeonId = null }) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const editId = pigeonId || searchParams.get("edit") || params?.id;
  const isEditMode = !!editId;
   const countries = getNames();

  const [createPigeon, { isLoading: isCreating }] = useCreatePigeonMutation();
  const [updatePigeon, { isLoading: isUpdating }] = useUpdatePigeonMutation();
  const { data: pigeonData } = useGetPigeonPackagesQuery([]);
  const { data: singlePigeon, isLoading: isLoadingSingle } =
    useGetSinglePigeonQuery(editId, {
      skip: !editId,
    });
  const { data: breeder } = useGetBreederQuery();
  const breederList = breeder?.data?.breeder;

  const [photos, setPhotos] = useState([]);
  const [raceResults, setRaceResults] = useState([]);
  const [showPigeonResult, setShowPigeonResult] = useState(false);

  // Color Pattern Selection States
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("");
  const [showPatterns, setShowPatterns] = useState(false);

  const colorPatternMap = {
    Blue: ["Barless", "Bar", "Check", "T-Check", "White Flight"],
    Black: ["Barless", "Bar", "Check", "T-Check", "White Flight"],
    White: ["Barless", "Bar", "Check", "T-Check", "White Flight"],
    Ash_Red: ["Barless", "Bar", "Check", "T-Check", "White Flight"],
    Brown: ["Barless", "Bar", "Check", "T-Check", "White Flight"],
    Red: ["Barless", "Bar", "Check", "T-Check", "White Flight"],
    Grizzle: ["Barless", "Bar", "Check", "T-Check", "White Flight"],
    Mealy: ["Barless", "Bar", "Check", "T-Check", "White Flight"],
  };

  // Add a new race result entry
  const addRaceResult = () => {
    const newResult = {
      id: Date.now(),
      name: "",
      date: "",
      distance: "",
      total: "",
      place: "",
    };
    setRaceResults((prev) => [...prev, newResult]);
  };

  // Remove a race result entry
  const removeRaceResult = (id) => {
    setRaceResults((prev) => prev.filter((result) => result.id !== id));
  };

  // Update a specific field in a race result
  const updateRaceResult = (id, field, value) => {
    setRaceResults((prev) =>
      prev.map((result) =>
        result.id === id ? { ...result, [field]: value } : result
      )
    );
  };

  // Color Pattern Handlers
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedPattern(""); // Reset pattern when color changes
    setShowPatterns(true);
    setValue("color", ""); // Clear form value until pattern is selected
  };

  const handlePatternSelect = (pattern) => {
    setSelectedPattern(pattern);
    setColorDropdownOpen(false);
    setShowPatterns(false);
  };

  const resetColorSelection = () => {
    setSelectedColor("");
    setSelectedPattern("");
    setShowPatterns(false);
    setValue("color", "");
  };

  const getColorDisplayValue = () => {
    if (selectedColor && selectedPattern) {
      return `${selectedColor.replace("_", " ")} & ${selectedPattern}`;
    } else if (selectedColor) {
      return selectedColor.replace("_", " ");
    }
    return "Select Color & Pattern";
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ringNumber: "",
      name: "",
      country: "Bangladesh",
      birthYear: new Date().getFullYear(),
      shortInfo: "",
      breeder: "", // This will store breeder ID
      color: "",
      pattern: "",
      gender: "",
      status: "Active",
      location: "Dhaka",
      notes: "",
      racingRating: 0,
      racherRating: "",
      breederRating: 0,
      fatherRingId: "",
      motherRingId: "",
      verified: false,
      iconic: false,
      iconicScore: 0,
    },
  });

  const isLoading = isCreating || isUpdating || isLoadingSingle;

  // Get available pigeons for parent selection
  const availablePigeons = pigeonData?.data?.data || [];

  // Sync color pattern with form
  useEffect(() => {
    if (selectedColor && selectedPattern) {
      const colorValue = `${selectedColor.replace(
        "_",
        " "
      )} & ${selectedPattern}`;
      setValue("color", colorValue);
    }
  }, [selectedColor, selectedPattern, setValue]);

  // Load pigeon data for edit mode
  useEffect(() => {
    if (isEditMode && singlePigeon?.data) {
      const pigeon = singlePigeon.data;
      reset({
        ringNumber: pigeon.ringNumber || "",
        name: pigeon.name || "",
        country: pigeon.country || "Bangladesh",
        birthYear: pigeon.birthYear || new Date().getFullYear(),
        shortInfo: pigeon.shortInfo || "",
        breeder: pigeon.breeder || "",
        color: pigeon.color || "",
        pattern: pigeon.pattern || "",
        gender: pigeon.gender || "",
        status: pigeon.status || "Active",
        location: pigeon.location || "Dhaka",
        notes: pigeon.notes || "",
        racherRating: pigeon.racherRating || "Good",
        breederRating: pigeon.breederRating || 0,
        fatherRingId: pigeon.fatherRingId || "",
        motherRingId: pigeon.motherRingId || "",
        verified: pigeon.verified || false,
        iconic: pigeon.iconic || false,
        iconicScore: pigeon.iconicScore || 0,
      });

      // Handle color pattern for edit mode
      if (pigeon.color) {
        const colorString = pigeon.color;
        const parts = colorString.split(" & ");
        if (parts.length === 2) {
          setSelectedColor(parts[0].replace(" ", "_"));
          setSelectedPattern(parts[1]);
        }
      }

      if (pigeon.photos && pigeon.photos.length > 0) {
        setPhotos(
          pigeon.photos.map((photo, index) => ({
            id: index,
            url: photo,
            file: null,
          }))
        );
      }

      // Load race results if they exist
      if (pigeon.results && Array.isArray(pigeon.results)) {
        setRaceResults(
          pigeon.results.map((result, index) => ({
            id: Date.now() + index,
            name: result.name || "",
            date: result.date || "",
            distance: result.distance || "",
            total: result.total || 0,
            place: result.place || "",
          }))
        );
        setShowPigeonResult(true);
      }
    }
  }, [isEditMode, singlePigeon, reset]);

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    if (photos.length + files.length > 6) {
      toast.error("You can upload maximum 6 photos");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            file,
            url: e.target.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoId) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  const onSubmit = async (data) => {
    try {
      const formDataToSend = new FormData();

      // Create the data object matching backend format
      const dataObject = {
        ringNumber: data.ringNumber,
        name: data.name,
        country: data.country,
        birthYear: parseInt(data.birthYear),
        shortInfo: data.shortInfo,
        breeder: data.breeder, // This should be breeder ID
        color: data.color,
        racingRating: parseInt(data.racingRating) || 0,
        racherRating: data.racherRating || "Good", // Fixed spelling
        breederRating: parseInt(data.breederRating) || 0,
        gender: data.gender,
        status: data.status,
        location: data.location,
        notes: data.notes,
        fatherRingId: data.fatherRingId || "",
        motherRingId: data.motherRingId || "",
        verified: Boolean(data.verified),
        iconic: Boolean(data.iconic),
        iconicScore: parseInt(data.iconicScore) || 0,
        // only for update -> keep remaining old images
        remaining: isEditMode
          ? photos.filter((photo) => !photo.file).map((photo) => photo.url)
          : [],
      };

      // Only add results if race results are enabled and there are results
      if (showPigeonResult && raceResults.length > 0) {
        const formattedResults = raceResults.map((result) => ({
          name: result.name,
          date: result.date,
          distance: result.distance,
          total: parseInt(result.total) || 0,
          place: result.place,
        }));
        dataObject.results = formattedResults;
      }

      // Append data as JSON string
      formDataToSend.append("data", JSON.stringify(dataObject));

      // Handle images for update vs create
      if (isEditMode) {
        const newImages = photos.filter((photo) => photo.file);

        // Append only new images
        newImages.forEach((photo) => {
          formDataToSend.append("image", photo.file);
        });
      } else {
        // For create: append all images
        photos.forEach((photo) => {
          if (photo.file) {
            formDataToSend.append("image", photo.file);
          }
        });
      }

      // Debug log
      for (let [key, value] of formDataToSend.entries()) {
        console.log("FormData entry:", key, value);
      }

      // API call
      if (isEditMode) {
        await updatePigeon({ id: editId, data: formDataToSend }).unwrap();
        toast.success("Pigeon updated successfully!");
      } else {
        await createPigeon(formDataToSend).unwrap();
        toast.success("Pigeon added successfully!");
      }

      router.push("/loft-overview");
    } catch (errorMessages) {
      console.error("Submit error:", errorMessages);
      toast.error(
        errorMessages.data.message ||
          `Failed to ${isEditMode ? "update" : "add"} pigeon`
      );
    }
  };

  return (
    <div className="my-8 md:my-12 lg:my-16 xl:my-20 px-4 md:px-8 lg:px-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-accent  text-center">
            {isEditMode ? "Edit" : "Add"}{" "}
            <span className="text-accent-foreground">Pigeon</span>
          </h1>
          <p className="text-destructive text-sm mt-1">
            Welcome to the pigeon pedigree database! To add a new pigeon, please
            fill out the following details. This will help us track its lineage
            and make it easier for you to manage your pigeons.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ring Number *
                  </label>
                  <input
                    type="text"
                    {...register("ringNumber", {
                      required: "Ring number is required",
                    })}
                    placeholder="Ring Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.ringNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.ringNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose a Country
                  </label>
                  <select
                    {...register("country", { required: true })}
                    defaultValue="" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="" disabled>
                      -- Select a country --
                    </option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Year
                  </label>
                  <select
                    {...register("birthYear", { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {Array.from(
                      { length: 10 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breeder
                  </label>
                  <select
                    {...register("breeder")}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Breeder</option>
                    {breederList &&
                      breederList.map((breeder) => (
                        <option
                          key={breeder._id || breeder.id}
                          value={breeder._id || breeder.id}
                        >
                          {breeder.breederName}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    {...register("location", {
                      required: "Location is required",
                    })}
                    placeholder="Write your location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Information of the pigeon
                </label>
                <textarea
                  {...register("shortInfo")}
                  placeholder="Brief description of the pigeon"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Physical Characteristics */}
              <div className="">
                <h2 className="text-lg font-semibold mb-4">
                  Physical Characteristics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Dynamic Color & Pattern Selector */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color & Pattern
                    </label>

                    {/* Main Button */}
                    <button
                      type="button"
                      onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-between bg-white text-left"
                      style={{
                        color:
                          selectedColor && selectedPattern ? "#000" : "#999",
                      }}
                    >
                      <span>{getColorDisplayValue()}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          colorDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Content */}
                    {colorDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
                        {!showPatterns ? (
                          // Color Selection
                          <div className="p-2">
                            <div className="text-xs text-gray-500 px-2 py-1 border-b">
                              Select Color:
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {Object.keys(colorPatternMap).map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => handleColorSelect(color)}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                >
                                  {color.replace("_", " ")}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          // Pattern Selection
                          <div className="p-2">
                            <div className="flex items-center justify-between px-2 py-1 border-b">
                              <span className="text-xs text-gray-500">
                                Select Pattern for{" "}
                                {selectedColor.replace("_", " ")}:
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowPatterns(false)}
                                className="text-xs text-teal-600 hover:text-teal-800"
                              >
                                ← Back
                              </button>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {colorPatternMap[selectedColor]?.map(
                                (pattern) => (
                                  <button
                                    key={pattern}
                                    type="button"
                                    onClick={() => handlePatternSelect(pattern)}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                  >
                                    {pattern}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Reset Option */}
                        {(selectedColor || selectedPattern) && (
                          <div className="border-t p-2">
                            <button
                              type="button"
                              onClick={resetColorSelection}
                              className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none text-sm"
                            >
                              Clear Selection
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Hidden input for react-hook-form */}
                    <input type="hidden" {...register("color")} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      {...register("gender")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Hen">Hen</option>
                      <option value="Cock">Cock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      {...register("status")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Racing">Racing</option>
                      <option value="Breeding">Breeding</option>
                      <option value="Sold">Sold</option>
                      <option value="Lost">Lost</option>
                      <option value="Deceased">Deceased</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className="">
                <h2 className="text-lg font-semibold mb-4">Ratings</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Racer Rating
                    </label>
                    <select
                      {...register("racherRating", {
                        required: "Racher Rating is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select Rating</option>
                      <option value="Outstanding">Outstanding</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Above Average">Above Average</option>
                    </select>
                    {errors.racherRating && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.racherRating.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Racing Rating
                    </label>
                    <select
                      {...register("racingRating", { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {Array.from({ length: 101 }, (_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Breeder Rating
                    </label>
                    <select
                      {...register("breederRating", { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {Array.from({ length: 101 }, (_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Iconic Score
                    </label>
                    <select
                      {...register("iconicScore", { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {Array.from({ length: 101 }, (_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  {...register("notes")}
                  placeholder="Additional notes about the pigeon"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            {/* Parent Selection */}
            <div className="bg-white rounded-lg p-6 shadow-sm ">
              <h2 className="text-lg font-semibold mb-4">Parent Selection</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father Ring ID
                  </label>
                  <input
                    type="text"
                    {...register("fatherRingId")}
                    placeholder="Father Ring Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter as part of the ring or part of the name to search for
                    the corresponding Pigeon
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mother Ring ID
                  </label>
                  <input
                    type="text"
                    {...register("motherRingId")}
                    placeholder="Mother Ring Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a short string or part of the name to search for the
                    corresponding Pigeon
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Photo Upload */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                Pigeon Photo <span className="text-red-500">*</span>
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="relative">
                    {photos[index] ? (
                      <div className="relative aspect-square border-2 border-gray-200 rounded-lg overflow-hidden group">
                        <Image
                          src={
                            photos[index].file
                              ? photos[index].url // Freshly uploaded
                              : getImageUrl(photos[index].url) // Existing from backend
                          }
                          alt={`Pigeon photo ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removePhoto(photos[index].id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-400 transition-colors bg-gray-50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          multiple
                        />
                        <Plus className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500 text-center px-2">
                          {index === 0
                            ? "Upload Pigeon Photo"
                            : index === 1
                            ? "Upload Eye Photo"
                            : index === 2
                            ? "Upload Ownership Card"
                            : "Original"}
                        </span>
                      </label>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Upload up to 6 photos. First photo will be the main display
                photo.
              </p>
            </div>

            <div className="flex items-center justify-between my-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="race-results-switch"
                    checked={showPigeonResult}
                    onCheckedChange={setShowPigeonResult}
                  />
                  <Label htmlFor="race-results-switch">Race Results</Label>
                </div>
                {showPigeonResult && (
                  <Button
                    type="button"
                    onClick={addRaceResult}
                    className="flex items-center gap-2 px-3 py-1 text-white transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Result Race
                  </Button>
                )}
              </div>
            </div>

            {showPigeonResult && (
              <div className="space-y-6">
                {raceResults.map((result, index) => (
                  <div
                    key={result.id}
                    className="border border-gray-200 rounded-lg p-4 relative"
                  >
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeRaceResult(result.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Race Result #{index + 1}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Race Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Race Name
                        </label>
                        <input
                          type="text"
                          value={result.name}
                          onChange={(e) =>
                            updateRaceResult(result.id, "name", e.target.value)
                          }
                          placeholder="Enter race name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      {/* Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={result.date}
                          onChange={(e) =>
                            updateRaceResult(result.id, "date", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      {/* Distance */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Distance
                        </label>
                        <input
                          type="text"
                          value={result.distance}
                          onChange={(e) =>
                            updateRaceResult(
                              result.id,
                              "distance",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 500m, 600m"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      {/* Total Birds */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Birds
                        </label>
                        <input
                          type="number"
                          value={result.total}
                          onChange={(e) =>
                            updateRaceResult(result.id, "total", e.target.value)
                          }
                          placeholder="Total participating birds"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      {/* Place/Position */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Place/Position
                        </label>
                        <input
                          type="text"
                          value={result.place}
                          onChange={(e) =>
                            updateRaceResult(result.id, "place", e.target.value)
                          }
                          placeholder="e.g., 1st, 2nd, Winner"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-1/3 px-12 py-6 text-white"
          >
            {isLoading
              ? isEditMode
                ? "Updating..."
                : "Adding..."
              : isEditMode
              ? "Update Pigeon"
              : "Add New Pigeon"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPigeonContainer;
