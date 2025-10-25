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
  useGetAllPigeonSearchQuery,
} from "@/redux/featured/pigeon/pigeonApi";
import { useGetBreederQuery } from "@/redux/featured/pigeon/breederApi";
import Image from "next/image";
import { getImageUrl } from "../share/imageUrl";
import { getNames } from "country-list";
import PigeonPhotosSlider from "./addPigeon/PigeonPhotoSlider";

const AddPigeonContainer = ({ pigeonId = null }) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const editId = pigeonId || searchParams.get("edit") || params?.id;
  const isEditMode = !!editId;
  const countries = getNames();
  const [fatherSearchTerm, setFatherSearchTerm] = useState("");
  const [motherSearchTerm, setMotherSearchTerm] = useState("");
  const [selectedFatherId, setSelectedFatherId] = useState("");
  const [selectedMotherId, setSelectedMotherId] = useState("");
  console.log("selectedFatherId", selectedFatherId);
  console.log("selectedMotherId", selectedMotherId);

  const [createPigeon, { isLoading: isCreating }] = useCreatePigeonMutation();
  const [updatePigeon, { isLoading: isUpdating }] = useUpdatePigeonMutation();
  const { data: pigeonData } = useGetPigeonPackagesQuery([]);
  const { data: singlePigeon, isLoading: isLoadingSingle } =
    useGetSinglePigeonQuery(editId, {
      skip: !editId,
    });
  console.log("singlePigeon", singlePigeon);
  const { data: breeder } = useGetBreederQuery();

  const { data: fatherData } = useGetAllPigeonSearchQuery(fatherSearchTerm);
  const { data: motherData } = useGetAllPigeonSearchQuery(motherSearchTerm);

  const fatherList = (fatherData?.data || []).filter(
    (item) => item.gender === "Cock"
  );

  const motherList = (motherData?.data || []).filter(
    (item) => item.gender === "Hen"
  );
  console.log("fatherList", fatherList);
  console.log("motherList", motherList);
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

  const [pigeonPhoto, setPigeonPhoto] = useState(null);
  const [eyePhoto, setEyePhoto] = useState(null);
  const [ownershipPhoto, setOwnershipPhoto] = useState(null);
  const [pedigreePhoto, setPedigreePhoto] = useState(null);
  const [DNAPhoto, setDNAPhoto] = useState(null);
  const [breederSearchTerm, setBreederSearchTerm] = useState("");
  const [selectedBreeder, setSelectedBreeder] = useState(null);
  const [showBreederDropdown, setShowBreederDropdown] = useState(false);
  const [fatherRingNumber, setFatherRingNumber] = useState("");
  const [motherRingNumber, setMotherRingNumber] = useState("");
  const [selectedFather, setSelectedFather] = useState();
  const [selectedMother, setSelectedMother] = useState();
  console.log("fatherRingNumber", fatherRingNumber);
  console.log("motherRingNumber", motherRingNumber);

  const currentYear = new Date().getFullYear();
  const futureYear = currentYear + 2;
  const startYear = 1927;

  const allYears = Array.from(
    { length: futureYear - startYear + 1 },
    (_, i) => startYear + i
  ).reverse();

  const [search, setSearch] = useState("");
  const [filteredYears, setFilteredYears] = useState(allYears);
  const [showDropdown, setShowDropdown] = useState(false);

  // Search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowDropdown(true);

    const filtered = allYears.filter((year) => year.toString().includes(value));
    setFilteredYears(filtered);
  };

  const handleSelect = (year) => {
    setSearch(year.toString());
    setValue("birthYear", year);
    setShowDropdown(false);

    console.log("Selected year:", year);
  };

  // Filtered years based on search input
  // const handleSearch = (e) => {
  //   const value = e.target.value;
  //   setSearch(value);
  //   setShowDropdown(true);

  //   const filtered = reversedYears.filter((year) =>
  //     year.toString().includes(value)
  //   );
  //   setFilteredYears(filtered);
  // };

  // const handleSearch = (e) => {
  //   const value = e.target.value;
  //   setSearch(value); // Update search state
  //   setShowDropdown(true); // Show dropdown on input change

  //   const filtered = reversedYears.filter((year) =>
  //     year.toString().includes(value)
  //   );
  //   setFilteredYears(filtered); // Update filtered years
  // };

  // handleSelect function to update both the input and the form value
  // const handleSelect = (year) => {
  //   setSearch(year.toString()); // input এ দেখাবে
  //   setShowDropdown(false);
  //   setValue("birthYear", year); // form value তে সংরক্ষণ করবে
  // };

  // Generic photo upload handler
  const handleSpecificPhotoUpload = (event, photoType, setPhotoState) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (e.g., 5MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoState({
        id: Date.now(),
        file,
        url: e.target.result,
        type: photoType,
      });
    };
    reader.readAsDataURL(file);
  };

  // Remove photo handler
  const removeSpecificPhoto = (setPhotoState) => {
    setPhotoState(null);
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
    setRaceResults((prevResults) =>
      prevResults.map((result) => {
        if (result.id === id) {
          let updatedValue = value;

          // Validation rules
          if (field === "date") {
            const today = new Date().toISOString().split("T")[0];
            if (new Date(value) > new Date(today)) {
              toast.error("Date must be in the past.");
              return result; // ignore invalid value
            }
          }

          if (field === "total") {
            if (value <= 0) {
              toast.error("Total birds must be a positive number.");
              return result;
            }
          }

          // if (field === "place") {
          //   const placeNum = parseInt(value, 10);
          //   if (isNaN(placeNum) || placeNum <= 0) {
          //     alert("Position must be a valid positive number.");
          //     return result;
          //   }
          //   if (placeNum > result.total) {
          //     alert("Position must be lower than total birds.");
          //     return result;
          //   }
          //   updatedValue = placeNum;
          // }

          return { ...result, [field]: updatedValue };
        }
        return result;
      })
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
      return `${selectedColor.replace("_", " ")}  ${selectedPattern}`;
    } else if (selectedColor) {
      return selectedColor.replace("_", " ");
    }
    return "Select Color  Pattern";
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
      country: "",
      birthYear: new Date().getFullYear(),
      shortInfo: "",
      breeder: "", // Changed from breeder object to empty string
      color: "",
      pattern: "",
      gender: "N/A",
      status: "",
      location: "",
      notes: "",
      racingRating: 0,
      racherRating: "",
      breederRating: 0,
      fatherRingId: selectedFatherId,
      motherRingId: selectedMotherId,
      verified: false,
      iconic: false,
      addresults: "",
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

  useEffect(() => {
    setValue("fatherRingId", selectedFatherId);
  }, [selectedFatherId, setValue]);

  useEffect(() => {
    setValue("motherRingId", selectedMotherId);
  }, [selectedMotherId, setValue]);

  // Load pigeon data for edit mode
  useEffect(() => {
    if (isEditMode && singlePigeon?.data) {
      const pigeon = singlePigeon.data;

      // Set parent ring numbers for display
      if (pigeon.fatherRingId?.ringNumber) {
        setFatherRingNumber(pigeon.fatherRingId.ringNumber);
        setFatherSearchTerm(pigeon.fatherRingId.ringNumber);
        setSelectedFatherId(pigeon.fatherRingId.ringNumber);
      }

      if (pigeon.motherRingId?.ringNumber) {
        setMotherRingNumber(pigeon.motherRingId.ringNumber);
        setMotherSearchTerm(pigeon.motherRingId.ringNumber);
        setSelectedMotherId(pigeon.motherRingId.ringNumber);
      }

      // Set breeder name for display
      if (pigeon.breeder) {
        const breederName =
          typeof pigeon.breeder === "object"
            ? pigeon.breeder.breederName
            : pigeon.breeder;
        setBreederSearchTerm(breederName);
        if (typeof pigeon.breeder === "object") {
          setSelectedBreeder(pigeon.breeder);
        }
      }

      reset({
        ringNumber: pigeon.ringNumber || "",
        name: pigeon.name || "",
        country: pigeon.country || "",
        birthYear: pigeon.birthYear || "",
        shortInfo: pigeon.shortInfo || "",
        breeder:
          typeof pigeon?.breeder === "object"
            ? pigeon?.breeder?.breederName
            : pigeon?.breeder || "",
        color: pigeon.color || "",
        pattern: pigeon.pattern || "",
        gender: pigeon.gender,
        status: pigeon.status || "",
        location: pigeon.location || "",
        notes: pigeon.notes || "",
        racherRating: pigeon.racherRating || "",
        breederRating: pigeon.breederRating || 0,
        fatherRingId: pigeon.fatherRingId?.ringNumber || "",
        motherRingId: pigeon.motherRingId?.ringNumber || "",
        verified: pigeon.verified || false,
        iconic: pigeon.iconic || false,

        // ✅ Correct way to handle addresults
        addresults: Array.isArray(pigeon.addresults)
          ? pigeon.addresults.join("\n")
          : pigeon.addresults || "",

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

      // Load photos for edit mode
      if (pigeon.pigeonPhoto) {
        setPigeonPhoto({ url: pigeon.pigeonPhoto });
      }
      if (pigeon.eyePhoto) {
        setEyePhoto({ url: pigeon.eyePhoto });
      }
      if (pigeon.ownershipPhoto) {
        setOwnershipPhoto({ url: pigeon.ownershipPhoto });
      }
      if (pigeon.pedigreePhoto) {
        setPedigreePhoto({ url: pigeon.pedigreePhoto });
      }
      if (pigeon.DNAPhoto) {
        setDNAPhoto({ url: pigeon.DNAPhoto });
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

  const onSubmit = async (data) => {
    try {
      const formDataToSend = new FormData();

      const dataObject = {
        ringNumber: data.ringNumber,
        name: data.name,
        country: data.country,
        birthYear: parseInt(data.birthYear),
        shortInfo: data.shortInfo,
        breeder: breederSearchTerm || data.breeder,
        color: data.color,
        racingRating: parseInt(data.racingRating) || 0,
        racherRating: data.racherRating || "",
        breederRating: parseInt(data.breederRating) || 0,
        gender: data.gender,
        status: data.status || "",
        location: data.location,
        notes: data.notes,
        fatherRingId: fatherSearchTerm || selectedFatherId || "",
        motherRingId: motherSearchTerm || selectedMotherId || "",
        verified: Boolean(data.verified),
        iconic: Boolean(data.iconic),
        addresults: data.addresults ? data.addresults.split("\n") : [],
        iconicScore: parseInt(data.iconicScore) || 0,
        remaining: isEditMode
          ? photos.filter((photo) => !photo.file).map((photo) => photo.url)
          : [],
      };

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

      // Handle specific photos properly
      if (isEditMode) {
        const remainingPhotos = {};

        if (pigeonPhoto) {
          if (pigeonPhoto.file) {
            formDataToSend.append("pigeonPhoto", pigeonPhoto.file);
          } else {
            remainingPhotos.pigeonPhoto = pigeonPhoto.url;
          }
        }

        if (eyePhoto) {
          if (eyePhoto.file) {
            formDataToSend.append("eyePhoto", eyePhoto.file);
          } else {
            remainingPhotos.eyePhoto = eyePhoto.url;
          }
        }

        if (ownershipPhoto) {
          if (ownershipPhoto.file) {
            formDataToSend.append("ownershipPhoto", ownershipPhoto.file);
          } else {
            remainingPhotos.ownershipPhoto = ownershipPhoto.url;
          }
        }

        if (pedigreePhoto) {
          if (pedigreePhoto.file) {
            formDataToSend.append("pedigreePhoto", pedigreePhoto.file);
          } else {
            remainingPhotos.pedigreePhoto = pedigreePhoto.url;
          }
        }

        if (DNAPhoto) {
          if (DNAPhoto.file) {
            formDataToSend.append("DNAPhoto", DNAPhoto.file);
          } else {
            remainingPhotos.DNAPhoto = DNAPhoto.url;
          }
        }

        dataObject.remainingPhotos = remainingPhotos;
      } else {
        if (pigeonPhoto?.file) {
          formDataToSend.append("pigeonPhoto", pigeonPhoto.file);
        }
        if (eyePhoto?.file) {
          formDataToSend.append("eyePhoto", eyePhoto.file);
        }
        if (ownershipPhoto?.file) {
          formDataToSend.append("ownershipPhoto", ownershipPhoto.file);
        }
        if (pedigreePhoto?.file) {
          formDataToSend.append("pedigreePhoto", pedigreePhoto.file);
        }
        if (DNAPhoto?.file) {
          formDataToSend.append("DNAPhoto", DNAPhoto.file);
        }
      }

      // Handle general photos
      if (isEditMode) {
        const newImages = photos.filter((photo) => photo.file);
        newImages.forEach((photo) => {
          formDataToSend.append("image", photo.file);
        });
      } else {
        photos.forEach((photo) => {
          if (photo.file) {
            formDataToSend.append("image", photo.file);
          }
        });
      }

      formDataToSend.append("data", JSON.stringify(dataObject));

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
        errorMessages?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} pigeon`
      );
    }
  };

  return (
    <div className="my-8 md:my-12 lg:my-16 xl:my-20 px-4 md:px-8 lg:px-12">
      {/* Header */}
      <div className="flex items-center gap-4 gap-x-10 mb-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-accent mb-4  text-center">
            {isEditMode ? "Edit" : "Add"} a New Pigeon to
            <span className="text-accent-foreground"> Your Loft ​</span>
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-x-12">
          {/* Left Column - Form Fields */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-10">
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
                    className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <Select
                    onValueChange={(value) => setValue("country", value)}
                    defaultValue={watch("country") || ""}
                  >
                    <SelectTrigger className="w-full px-3 py-[25px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country, index) => (
                        <SelectItem key={index} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Year
                  </label>

                  <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Select Pigeon Birth Year"
                    className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />

                  {/* Hidden input for react-hook-form */}
                  <input type="hidden" {...register("birthYear")} />

                  {showDropdown && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg max-h-48 overflow-y-auto shadow-md mt-1">
                      {filteredYears.length > 0 ? (
                        filteredYears.map((year) => (
                          <li
                            key={year}
                            onClick={() => handleSelect(year)}
                            className="px-3 py-2 hover:bg-teal-100 cursor-pointer"
                          >
                            {year}
                          </li>
                        ))
                      ) : (
                        <li className="px-3 py-2 text-gray-500">
                          No results found
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 gap-x-10">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story Line
                  </label>
                  <textarea
                    {...register("shortInfo")}
                    placeholder={`For example:
Son of Burj Khalifa
Winner of the Dubai OLR
5 times 1st price winner
Bought for USD 50,000`}
                    rows={5}
                    className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Breeder Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        {...register("breeder")}
                        value={breederSearchTerm}
                        onChange={(e) => {
                          setBreederSearchTerm(e.target.value);
                          setShowBreederDropdown(true);
                          setSelectedBreeder(null);
                        }}
                        onFocus={() => setShowBreederDropdown(true)}
                        onBlur={() =>
                          setTimeout(() => setShowBreederDropdown(false), 200)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && breederSearchTerm) {
                            e.preventDefault();
                            // Check if there are no matches in the existing list
                            const matches = breederList?.filter((breeder) =>
                              breeder.breederName
                                .toLowerCase()
                                .includes(breederSearchTerm.toLowerCase())
                            );
                            if (matches?.length === 0) {
                              // Use the typed value as a new breeder
                              setValue("breeder", breederSearchTerm);
                              setShowBreederDropdown(false);
                            }
                          }
                        }}
                        placeholder="Type or Select Breeder Name"
                        className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />

                      {/* Dropdown list for verified breeders */}
                      {showBreederDropdown &&
                        breederList &&
                        breederList.length > 0 && (
                          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto shadow-md mt-1">
                            {breederSearchTerm
                              ? breederList
                                  .filter((breeder) =>
                                    breeder.breederName
                                      .toLowerCase()
                                      .includes(breederSearchTerm.toLowerCase())
                                  )
                                  .map((breeder) => (
                                    <li
                                      key={breeder._id || breeder.id}
                                      className="px-3 py-2 hover:bg-teal-100 cursor-pointer"
                                      onClick={() => {
                                        setBreederSearchTerm(
                                          breeder.breederName
                                        );
                                        setSelectedBreeder(breeder);
                                        setShowBreederDropdown(false);
                                        setValue(
                                          "breeder",
                                          breeder.breederName
                                        );
                                      }}
                                    >
                                      {breeder.breederName}
                                    </li>
                                  ))
                              : breederList.map((breeder) => (
                                  <li
                                    key={breeder._id || breeder.id}
                                    className="px-3 py-2 hover:bg-teal-100 cursor-pointer"
                                    onClick={() => {
                                      setBreederSearchTerm(breeder.breederName);
                                      setSelectedBreeder(breeder);
                                      setShowBreederDropdown(false);
                                      setValue("breeder", breeder.breederName);
                                    }}
                                  >
                                    {breeder.breederName}
                                  </li>
                                ))}
                            {breederSearchTerm &&
                              breederList.filter((breeder) =>
                                breeder.breederName
                                  .toLowerCase()
                                  .includes(breederSearchTerm.toLowerCase())
                              ).length === 0 && (
                                <li className="px-3 py-2 text-gray-500">
                                  No matches found. Press Enter to add "
                                  {breederSearchTerm}" as a new breeder.
                                </li>
                              )}
                          </ul>
                        )}

                      {/* Show selected breeder info */}
                      {/* {selectedBreeder && (
                        <div className="mt-2 p-2 border border-gray-200 rounded bg-gray-50">
                          <p className="text-sm">
                            <span className="font-medium">Breeder:</span>{" "}
                            {selectedBreeder.breederName}
                          </p>
                        </div>
                      )} */}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Breeder Rating
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setValue("breederRating", value)
                      }
                      defaultValue={watch("breederRating") || ""}
                    >
                      <SelectTrigger className="w-full px-3 py-[25px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <SelectValue placeholder="Select Breeder Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 99 }, (_, i) => i + 1)
                          .reverse()
                          .map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Physical Characteristics */}
              <div className="">
                {/* <h2 className="text-lg font-semibold mb-4">
                  Physical Characteristics
                </h2> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-10">
                  {/* Dynamic Color & Pattern Selector */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Pattern
                    </label>

                    {/* Main Button */}
                    <button
                      type="button"
                      onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                      className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-between bg-white text-left"
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
                                  className="w-full text-left px-3 py-[14px] hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
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
                                    className="w-full text-left px-3 py-[14px] hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
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
                              className="w-full text-left px-3 py-[14px] text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none text-sm"
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
                      Gender *
                    </label>
                    <Select
                      onValueChange={(value) => setValue("gender", value)}
                      defaultValue={watch("gender") || ""}
                    >
                      <SelectTrigger className="w-full px-3 py-[25px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hen">Hen</SelectItem>
                        <SelectItem value="Cock">Cock</SelectItem>
                        <SelectItem value="Unspecified">Unspecified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <Select
                      onValueChange={(value) => setValue("status", value)}
                      defaultValue={watch("status") || ""}
                    >
                      <SelectTrigger className="w-full px-3 py-[25px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Breeding">Breeding</SelectItem>
                        <SelectItem value="Racing">Racing</SelectItem>
                        <SelectItem value="Sold">Sold</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                        <SelectItem value="Deceased">Deceased</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      {...register("location")}
                      placeholder="Location"
                      className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-10">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Racer Rating
                    </label>
                    <select
                      {...register("racherRating")}
                      className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Racing Rating
                    </label>

                    <Select
                      onValueChange={(value) =>
                        setValue("racingRating", Number(value))
                      } 
                      defaultValue=""
                    >
                      <SelectTrigger className="w-full px-3 py-[25px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <SelectValue placeholder="Select Racing Rating" />
                      </SelectTrigger>

                      <SelectContent className="bg-white text-gray-800 border border-gray-200 rounded-md shadow-lg">
                       
                        {Array.from({ length: 99 }, (_, i) => i + 1)
                          .reverse()
                          .map((rating) => (
                            <SelectItem key={rating} value={String(rating)}>
                              {rating}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
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
                  className="w-full px-3 py-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            {/* Parent Selection */}
            <div className="bg-white rounded-lg p-6 shadow-sm ">
              {/* <h2 className="text-lg font-semibold mb-4">Parent Selection</h2> */}
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
                                setSelectedFatherId(pigeon.ringNumber); // fixed: should be _id
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
                                setSelectedMotherId(pigeon.ringNumber); // ✅ _id save korte hobe
                                setMotherSearchTerm(pigeon.ringNumber);
                                setMotherRingNumber(pigeon.ringNumber);
                                setSelectedMother(pigeon); // ✅ full pigeon info store korbe
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
          </div>

          {/* Right Column - Photo Upload */}
          <div className="bg-white rounded-lg lg:col-span-2 p-6 shadow-sm ">
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
                Pigeon Results
              </label>
              <textarea
                {...register("addresults")}
                placeholder={`For example:
1st/828p Quiévrain 108km
4th/3265p Melun 287km
6th/3418p HotSpot 6 Dubai OLR`}
                className="w-full px-3 h-60 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
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
