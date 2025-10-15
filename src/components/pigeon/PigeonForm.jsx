"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import PigeonBasicInfo from "./PigeonBasicInfo";
import PigeonParentInfo from "./PigeonParentInfo";
import PigeonPhotosUpload from "./PigeonPhotosUpload";

const PigeonForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // State for pigeon data
  const [pigeonList, setPigeonList] = useState([]);
  const [breederList, setBreederList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for parent pigeon data
  const [fatherPigeon, setFatherPigeon] = useState(null);
  const [motherPigeon, setMotherPigeon] = useState(null);
  const [fatherSearchResults, setFatherSearchResults] = useState([]);
  const [motherSearchResults, setMotherSearchResults] = useState([]);

  // State for photos
  const [pigeonPhoto, setPigeonPhoto] = useState([]);
  const [eyePhoto, setEyePhoto] = useState([]);
  const [ownershipPhoto, setOwnershipPhoto] = useState([]);
  const [pedigreePhoto, setPedigreePhoto] = useState([]);
  const [DNAPhoto, setDNAPhoto] = useState([]);

  // State for race results
  const [raceResults, setRaceResults] = useState([]);
  const [showPigeonResult, setShowPigeonResult] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pigeonRes, breederRes, countryRes] = await Promise.all([
          axios.get("/api/pigeon"),
          axios.get("/api/breeder"),
          axios.get("/api/country"),
        ]);

        setPigeonList(pigeonRes.data);
        setBreederList(breederRes.data);
        setCountryList(countryRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load initial data");
      }
    };

    fetchData();
  }, []);

  // Handle photo uploads
  const handleSpecificPhotoUpload = (e, photoType, setPhotoType) => {
    const files = Array.from(e.target.files);
    setPhotoType([...photoType, ...files]);
  };

  const removeSpecificPhoto = (index, photoType, setPhotoType) => {
    const updatedPhotos = [...photoType];
    updatedPhotos.splice(index, 1);
    setPhotoType(updatedPhotos);
  };

  const getImageUrl = (file) => {
    return URL.createObjectURL(file);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add basic pigeon data
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      // Add breeder information
      formData.append("breeder", data.breeder);
      
      // Add parent information
      formData.append("fatherRingId", data.fatherRingId);
      formData.append("motherRingId", data.motherRingId);

      // Add photos
      pigeonPhoto.forEach((file) => {
        formData.append("pigeonPhoto", file);
      });
      eyePhoto.forEach((file) => {
        formData.append("eyePhoto", file);
      });
      ownershipPhoto.forEach((file) => {
        formData.append("ownershipPhoto", file);
      });
      pedigreePhoto.forEach((file) => {
        formData.append("pedigreePhoto", file);
      });
      DNAPhoto.forEach((file) => {
        formData.append("DNAPhoto", file);
      });

      // Add race results
      if (showPigeonResult && raceResults.length > 0) {
        formData.append("raceResults", JSON.stringify(raceResults));
      }

      // Submit the form
      const response = await axios.post("/api/pigeon", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Pigeon added successfully!");
      router.push("/pigeon");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add pigeon");
    } finally {
      setLoading(false);
    }
  };

  // Handle father pigeon search
  const handleFatherSearch = async (query) => {
    if (query.length < 2) {
      setFatherSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`/api/pigeon/search?query=${query}`);
      setFatherSearchResults(response.data);
    } catch (error) {
      console.error("Error searching for father pigeon:", error);
      toast.error("Failed to search for father pigeon");
    }
  };

  // Handle mother pigeon search
  const handleMotherSearch = async (query) => {
    if (query.length < 2) {
      setMotherSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`/api/pigeon/search?query=${query}`);
      setMotherSearchResults(response.data);
    } catch (error) {
      console.error("Error searching for mother pigeon:", error);
      toast.error("Failed to search for mother pigeon");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PigeonBasicInfo
          register={register}
          errors={errors}
          countryList={countryList}
          breederList={breederList}
        />

        <PigeonParentInfo
          register={register}
          fatherPigeon={fatherPigeon}
          setFatherPigeon={setFatherPigeon}
          motherPigeon={motherPigeon}
          setMotherPigeon={setMotherPigeon}
          fatherSearchResults={fatherSearchResults}
          motherSearchResults={motherSearchResults}
          handleFatherSearch={handleFatherSearch}
          handleMotherSearch={handleMotherSearch}
        />

        <PigeonPhotosUpload
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
          register={register}
          raceResults={raceResults}
          setRaceResults={setRaceResults}
          showPigeonResult={showPigeonResult}
          setShowPigeonResult={setShowPigeonResult}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Pigeon..." : "Add Pigeon"}
        </button>
      </div>
    </form>
  );
};

export default PigeonForm;