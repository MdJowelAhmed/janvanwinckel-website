"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
} from "lucide-react";
import { useGetSinglePigeonQuery } from "@/redux/featured/pigeon/pigeonApi";
import { useParams, useRouter } from "next/navigation";
import { getImageUrl } from "../share/imageUrl";
import Image from "next/image";
import Spinner from "@/app/(commonLayout)/Spinner";
import moment from "moment";
import { useGetAllSiblingsQuery } from "@/redux/featured/pigeon/breederApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMyProfileQuery } from "@/redux/featured/auth/authApi";
import PigeonPdfExport from "./OverviewExport";
import SyncHorizontalScroll from "../share/Scrollbar";

const PigeonOverviewContainer = () => {
  const { id } = useParams();
  const [showSiblings, setShowSiblings] = useState(true);
  const [showRaceResults, setShowRaceResults] = useState(true);
  const [showPigeonModal, setShowPigeonModal] = useState(false);
  const [selectedPigeon, setSelectedPigeon] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: userData } = useMyProfileQuery();
  const router = useRouter();

  const userRole = userData?.role;

  const { data, isLoading } = useGetSinglePigeonQuery(id);
  const { data: siblingsData, isLoading: siblingsLoading } =
    useGetAllSiblingsQuery(id);

  const siblings = siblingsData?.data?.siblings || [];
  const pigeon = data?.data;

  // Get all available images (excluding PDFs)
  // const getAvailableImages = () => {
  //   const images = [];
  //   if (pigeon?.pigeonPhoto) images.push(pigeon.pigeonPhoto);
  //   if (pigeon?.eyePhoto) images.push(pigeon.eyePhoto);
  //   if (pigeon?.ownershipPhoto) images.push(pigeon.ownershipPhoto);
  //   return images;
  // };

  const getAvailableImages = () => {
    const images = [];
    if (pigeon?.pigeonPhoto)
      images.push({
        type: "image",
        url: pigeon.pigeonPhoto,
        name: "Pigeon Photo",
      });
    if (pigeon?.eyePhoto)
      images.push({ type: "image", url: pigeon.eyePhoto, name: "Eye Photo" });
    if (pigeon?.ownershipPhoto)
      images.push({
        type: "image",
        url: pigeon.ownershipPhoto,
        name: "Ownership Photo",
      });

    // Add PDFs
    if (
      pigeon?.pedigreePhoto &&
      pigeon.pedigreePhoto.toLowerCase().endsWith(".pdf")
    ) {
      images.push({
        type: "pdf",
        url: pigeon.pedigreePhoto,
        name: "Pedigree Document",
      });
    }
    if (pigeon?.DNAPhoto && pigeon.DNAPhoto.toLowerCase().endsWith(".pdf")) {
      images.push({ type: "pdf", url: pigeon.DNAPhoto, name: "DNA Document" });
    }

    return images;
  };

  const availableImages = pigeon ? getAvailableImages() : [];
  // Get all available PDFs
  const getAvailablePDFs = () => {
    const pdfs = [];
    if (
      pigeon?.pedigreePhoto &&
      pigeon.pedigreePhoto.toLowerCase().endsWith(".pdf")
    ) {
      pdfs.push({ url: pigeon.pedigreePhoto, name: "Pedigree Document" });
    }
    if (pigeon?.DNAPhoto && pigeon.DNAPhoto.toLowerCase().endsWith(".pdf")) {
      pdfs.push({ url: pigeon.DNAPhoto, name: "DNA Document" });
    }
    return pdfs;
  };

  // const availableImages = pigeon ? getAvailableImages() : [];
  const availablePDFs = pigeon ? getAvailablePDFs() : [];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? availableImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === availableImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleDownloadPDF = (pdfUrl, fileName) => {
    const link = document.createElement("a");
    link.href = getImageUrl(pdfUrl);
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!pigeon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No pigeon data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6 ">
        <div className="w-full flex justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {pigeon?.name || ""} Overview
          </h2>
          <PigeonPdfExport pigeon={pigeon} siblings={siblings} />
        </div>

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pigeon Image with Carousel */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden p-2">
              <div className="aspect-square flex items-center justify-center relative pb-6">
                <div className="w-full h-full mx-auto rounded-md relative overflow-hidden">
                  {availableImages.length > 0 ? (
                    <>
                      {/* Main Image or PDF */}
                      {availableImages[currentImageIndex].type === "image" ? (
                        <Image
                          src={getImageUrl(
                            availableImages[currentImageIndex].url
                          )}
                          alt={availableImages[currentImageIndex].name}
                          height={400}
                          width={400}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div
                          onClick={() =>
                            handleDownloadPDF(
                              availableImages[currentImageIndex].url,
                              `${availableImages[currentImageIndex].name}.pdf`
                            )
                          }
                          className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center cursor-pointer hover:from-red-100 hover:to-red-200 transition-all rounded-md"
                        >
                          <FileText className="w-24 h-24 text-red-600 mb-4" />
                          <p className="font-semibold text-gray-800 text-lg">
                            {availableImages[currentImageIndex].name}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            Click to download PDF
                          </p>
                          <Download className="w-6 h-6 text-red-600 mt-3" />
                        </div>
                      )}

                      {/* Navigation Arrows - same as before */}
                      {availableImages.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          <button
                            onClick={handleNextImage}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full rounded-md bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-sm text-gray-500">
                          No Image Available
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Dots (outside image container) */}
                {availableImages.length > 1 && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {availableImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex
                            ? "bg-accent-foreground w-5 h-2 "
                            : "bg-accent hover:bg-accent/90"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* PDF Documents Section */}
              {/* {availablePDFs.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documents
                  </h3>
                  {availablePDFs.map((pdf, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-accent-foreground">{pdf.name}</p>
                          <p className="text-xs text-muted-foreground">PDF Document</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownloadPDF(pdf.url, `${pdf.name}.pdf`)}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )} */}
            </div>
          </div>

          {/* Basic Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-bold text-accent flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Name:{" "}
                          <strong className="text-accent-foreground">
                            {pigeon?.name || "N/A"}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Ring Number:{" "}
                          <strong className="text-accent-foreground">
                            {pigeon?.ringNumber || "N/A"}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Birth Year:{" "}
                          <strong className="text-accent-foreground">
                            {pigeon?.birthYear || "N/A"}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Gender:{" "}
                          <strong className="text-accent-foreground">
                            {pigeon?.gender || "N/A"}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Color:{" "}
                          <strong className="text-accent-foreground">
                            {pigeon?.color || "N/A"}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Country:{" "}
                          <strong className="text-accent-foreground">
                            {pigeon?.country || "N/A"}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Status:{" "}
                          <strong className="text-accent-foreground">
                            {pigeon?.status || "Racing"}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

   
        {/* Father and Mother Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-accent">
                Father Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Ring Number:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.fatherRingId?.ringNumber || "N/A"}
                  </strong>
                </p>
                <p className="text-sm text-gray-600">
                  Name:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.fatherRingId?.name || "N/A"}
                  </strong>
                </p>
                <p className="text-sm text-gray-600">
                  Birth Year:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.fatherRingId?.birthYear || "N/A"}
                  </strong>
                </p>
                <p className="text-sm text-gray-600">
                  Country:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.fatherRingId?.country || "N/A"}
                  </strong>
                </p>

                <p className="text-sm text-gray-600">
                  Breeder:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.fatherRingId?.breeder?.breederName || "N/A"}
                  </strong>
                </p>

                 <p className="text-sm text-gray-600">
                  Story:{" "}
                  <strong className="text-accent-foreground whitespace-pre-line">
                    {pigeon?.fatherRingId?.shortInfo?.replace(/\\n/g, "\n") ||
                      "N/A"}
                  </strong>
                </p>

                <div className="flex gap-1">
                  <p className="font-normal text-[14px]">Results: </p>
                  <p className="font-semibold text-[14px]">
                    {/* {safeValue(pigeonData.fatherRingId?.results)} */}
                    <span className="font-normal text-[14px]">
                      {Array.isArray(pigeon?.fatherRingId?.addresults) &&
                      pigeon?.fatherRingId?.addresults.length > 0
                        ? pigeon?.fatherRingId?.addresults.map(
                            (result, index) => <div key={index}>{result}</div>
                          )
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-accent">
                Mother Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Ring Number:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.motherRingId?.ringNumber || "N/A"}
                  </strong>
                </p>
                <p className="text-sm text-gray-600">
                  Name:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.motherRingId?.name || "N/A"}
                  </strong>
                </p>
                <p className="text-sm text-gray-600">
                  Birth Year:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.motherRingId?.birthYear || "N/A"}
                  </strong>
                </p>
                <p className="text-sm text-gray-600">
                  Country:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.motherRingId?.country || "N/A"}
                  </strong>
                </p>
               
                  <p className="text-sm text-gray-600">
                    Breeder:{" "}
                    <strong className="text-accent-foreground">
                      {pigeon?.motherRingId?.breeder?.breederName || "N/A"}
                    </strong>
                  </p>
              

                <p className="text-sm text-gray-600">
                  Story:{" "}
                  <strong className="text-accent-foreground whitespace-pre-line">
                    {pigeon?.motherRingId?.shortInfo?.replace(/\\n/g, "\n") ||
                      "N/A"}
                  </strong>
                </p>

                <div className="flex gap-1">
                  <p className="font-normal text-[14px]">Results: </p>
                  <p className="font-semibold text-[14px]">
                    {/* {safeValue(pigeonData.fatherRingId?.results)} */}
                    <span className="font-normal text-[14px]">
                      {Array.isArray(pigeon?.motherRingId?.addresults) &&
                      pigeon?.motherRingId?.addresults.length > 0
                        ? pigeon?.motherRingId?.addresults.map(
                            (result, index) => <div key={index}>{result}</div>
                          )
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-bold text-accent">
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
              <div className="space-y-4">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <div>
                    {" "}
                    Breeder:{" "}
                    <strong className="text-accent-foreground">
                      {pigeon?.breeder?.breederName || "N/A"}
                    </strong>
                  </div>
                  {pigeon?.breeder?.status ? (
                    <Image
                      src="/assests/Letter-B.png"
                      alt="Verified"
                      height={20}
                      width={20}
                      className="w-5 h-5 inline-block"
                    />
                  ) : null}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <div>
                    Breeder Loft Name:{" "}
                    <strong className="text-accent-foreground">
                      {pigeon?.breeder?.loftName || "N/A"}
                    </strong>
                  </div>
                  {pigeon?.breeder?.status ? (
                    <Image
                      src="/assests/Letter-B.png"
                      alt="Verified"
                      height={20}
                      width={20}
                      className="w-5 h-5 inline-block"
                    />
                  ) : null}
                </div>
                <p className="text-sm text-gray-600">
                  Location:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.location || "N/A"}
                  </strong>
                </p>
                <p className="text-sm text-gray-600">
                  Father Ring Number:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.fatherRingId?.ringNumber || "N/A"}
                  </strong>
                </p>
                <p className="text-sm text-gray-600">
                  Mother Ring Number:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.motherRingId?.ringNumber || "N/A"}
                  </strong>
                </p>
                <p className="text-sm text-gray-600">
                  Country:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.country || "N/A"}
                  </strong>
                </p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.status || "N/A"}
                  </strong>
                </p>
              </div>
            </div>

            <div>
              <p>
                <strong className="text-accent-foreground font-semibold">
                  Your Story:{" "}
                </strong>
                <span className="whitespace-pre-line">
                  {pigeon?.shortInfo
                    ? pigeon.shortInfo.replace(/\\n/g, "\n")
                    : "N/A"}
                </span>
              </p>
            </div>
            {pigeon?.notes && (
              <div>
                <p>
                  <strong className="text-accent-foreground font-semibold">
                    Notes:{" "}
                  </strong>
                  <span>{pigeon?.notes}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Siblings Information */}
        {/* {(userRole === "PAIDUSER" || userRole === "SUPER_ADMIN" || userRole === "ADMIN") && (
         
        )} */}

        <Card>
          <CardHeader>
            <button
              className="w-full justify-between p-0 h-auto"
              onClick={() => setShowSiblings(!showSiblings)}
            >
              <CardTitle className="text-xl font-bold text-accent flex items-center justify-between gap-2 w-full">
                Siblings Information
                {showSiblings ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </CardTitle>
            </button>
          </CardHeader>
          {showSiblings && (
            <CardContent>
              {siblingsLoading ? (
                <div className="flex justify-center p-4">
                  <Spinner />
                </div>
              ) : siblings.length > 0 ? (
                <div className="overflow-x-auto whitespace-nowrap  rounded-lg">
                  <SyncHorizontalScroll
                    containerClassName="overflow-x-auto border rounded-lg shadow-md bg-red-600 custom-scrollbar hide-scrollbar cursor-grab"
                    watch={siblings.length}
                  >
                    <div
                      style={{
                        minWidth: siblings.length > 0 ? "max-content" : "100%",
                      }}
                      className="bg-red-600 rounded-lg"
                    >
                      <style>{`
              div.overflow-x-auto::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
              }
            `}</style>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-foreground text-white">
                            <th className="text-left p-3 font-semibold">
                              Name
                            </th>
                            <th className="text-left p-3 font-semibold">
                              Siblings Type
                            </th>
                            <th className="text-left p-3 font-semibold">
                              Ring Number
                            </th>
                            <th className="text-left p-3 font-semibold">
                              Birth Year
                            </th>
                            <th className="text-left p-3 font-semibold">
                              Breeder Rating
                            </th>
                            <th className="text-left p-3 font-semibold">
                              Racing Rating
                            </th>
                            <th className="text-left p-3 font-semibold">
                              Father
                            </th>
                            <th className="text-left p-3 font-semibold">
                              Mother
                            </th>
                            <th className="text-left p-3 font-semibold">
                              Gender
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {siblings.map((sibling, index) => (
                            <tr
                              key={sibling._id || index}
                              className="border-b bg-background text-white"
                            >
                              <td className="p-3 font-medium">
                                {sibling.name || "N/A"}
                              </td>

                              <td
                                onClick={() =>
                                  sibling._id &&
                                  router.push(`/pedigree-chart/${sibling._id}`)
                                }
                                className="p-3 text-[#3AB27F] cursor-pointer hover:underline hover:text-[#2E8B57] transition-colors"
                              >
                                {sibling.type || "N/A"}
                              </td>

                              <td className="p-3">
                                {sibling.ringNumber || "N/A"}
                              </td>
                              <td className="p-3">
                                {sibling.birthYear || "N/A"}
                              </td>
                              <td className="p-3">
                                {sibling.breederRating || "N/A"}
                              </td>
                              <td className="p-3">
                                {sibling.racingRating || "N/A"}
                              </td>
                              <td className="p-3">
                                {sibling.fatherRingId?.ringNumber || "N/A"}
                              </td>
                              <td className="p-3">
                                {sibling.motherRingId?.ringNumber || "N/A"}
                              </td>
                              <td className="p-3">{sibling.gender || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SyncHorizontalScroll>
                </div>
              ) : (
                <p className="text-gray-500 italic text-center p-4">
                  No siblings found
                </p>
              )}
            </CardContent>
          )}
        </Card>

        {/* Race Results */}
        <Card>
          <div>
            {pigeon?.addresults && Array.isArray(pigeon.addresults) && (
              <div className="mt-4 px-6">
                <label className="block text-sm lg:text-xl font-bold text-accent mb-2">
                  Pigeon Results
                </label>
                <div className="text-gray-700 space-y-1">
                  {pigeon.addresults.map((result, index) => (
                    <p key={index}>{result}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Pigeon Details Modal */}
      <Dialog open={showPigeonModal} onOpenChange={setShowPigeonModal}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-accent flex items-center justify-between">
              <span>Sibling Pigeon Details</span>
              {selectedPigeon?.verified && (
                <Badge className="bg-green-500 text-white">Verified</Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedPigeon && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-full aspect-square rounded-md overflow-hidden mb-4">
                  {selectedPigeon?.photos?.[0] ? (
                    <Image
                      src={getImageUrl(selectedPigeon.photos[0])}
                      alt={selectedPigeon?.name || "Pigeon"}
                      height={300}
                      width={300}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-accent">No Image</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-accent">
                  {selectedPigeon.name || "N/A"}
                </h3>
                <p className="text-sm text-accent">
                  Ring Number: {selectedPigeon.ringNumber || "N/A"}
                </p>
              </div>

              <div className="space-y-4 text-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold">Birth Year</p>
                    <p className="text-white">
                      {selectedPigeon.birthYear || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Gender</p>
                    <p className="text-white">
                      {selectedPigeon.gender || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Color</p>
                    <p className="text-white">
                      {selectedPigeon.color || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Country</p>
                    <p className="text-white">
                      {selectedPigeon.country || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Status</p>
                    <p className="text-white">
                      {selectedPigeon.status || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Type</p>
                    <p className="text-white">{selectedPigeon.type || "N/A"}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-white">
                  <h4 className="font-semibold">Ratings</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-semibold">Breeder Rating</p>
                      <p className="text-white">
                        {selectedPigeon.breederRating || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Racer Rating</p>
                      <p className="text-white">
                        {selectedPigeon.racerRating || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Racing Rating</p>
                      <p className="text-white">
                        {selectedPigeon.racingRating || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold">Location</h4>
                  <p className="text-white">
                    {selectedPigeon.location || "N/A"}
                  </p>
                </div>

                {selectedPigeon.notes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-semibold">Notes</h4>
                      <p className="text-white">{selectedPigeon.notes}</p>
                    </div>
                  </>
                )}

                {selectedPigeon.shortInfo && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-semibold">Short Info</h4>
                      <p className="text-white">{selectedPigeon.shortInfo}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PigeonOverviewContainer;
