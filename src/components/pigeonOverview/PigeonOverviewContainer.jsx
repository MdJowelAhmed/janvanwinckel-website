"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Award,
  MapPin,
  Calendar,
  User,
  Palette,
  Activity,
  Heart,
  Baby,
} from "lucide-react";
import { useGetSinglePigeonQuery } from "@/redux/featured/pigeon/pigeonApi";
import { useParams } from "next/navigation";
import { getImageUrl } from "../share/imageUrl";
import Image from "next/image";
import Spinner from "@/app/(commonLayout)/Spinner";
import moment from "moment";
import { useGetAllSiblingsQuery } from "@/redux/featured/pigeon/breederApi";
import { FaEdit, FaRegEye } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const PigeonOverviewContainer = () => {
  const { id } = useParams();
  console.log(id);
  const [showSiblings, setShowSiblings] = useState(true);
  const [showRaceResults, setShowRaceResults] = useState(true);
  const [showPigeonModal, setShowPigeonModal] = useState(false);
  const [selectedPigeon, setSelectedPigeon] = useState(null);
  
  const { data, isLoading } = useGetSinglePigeonQuery(id);
  const { data: siblingsData, isLoading: siblingsLoading } = useGetAllSiblingsQuery(id);
  
  console.log("siblingsData", siblingsData);
  const siblings = siblingsData?.data?.siblings || [];
  console.log("siblings", siblings);

  const pigeon = data?.data;
  // console.log(pigeon);
  // console.log(pigeon?.photos?.[0]);
  // console.log(pigeon?.results);

  // Fix 1: Return spinner properly
  if (isLoading) {
    return <Spinner />;
  }

  // Fix 2: Handle case when pigeon data is not available
  if (!pigeon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No pigeon data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pigeon Image */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden p-2">
              <div className="aspect-square flex items-center justify-center">
                <div className="w-full h-full mx-auto rounded-full">
                  {pigeon?.photos?.[0] ? (
                    <Image
                      src={getImageUrl(pigeon.photos[0])}
                      alt={pigeon?.name || "Pigeon"}
                      height={100}
                      width={100}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">No Img</span>
                    </div>
                  )}
                </div>
              </div>
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
                {/* <FaEdit className="w-4 h-4 text-gray-400" /> */}
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
              {pigeon?.fatherRingId ? (
                <p className="text-gray-500 italic">
                  Father:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.fatherRingId?.name || "N/A"}
                  </strong>
                </p>
              ) : (
                <p className="text-gray-500 italic">
                  Information not available
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-accent">
                Mother Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pigeon?.motherRingId ? (
                <p className="text-gray-500 italic">
                  Mother:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.motherRingId?.name || "N/A"}
                  </strong>
                </p>
              ) : (
                <p className="text-gray-500 italic">
                  Information not available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-bold text-accent">
              Additional Information
            </CardTitle>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Breeder:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.breeder?.breederName || "N/A"}
                  </strong>
                </p>
                <p className="text-sm text-gray-600">
                  Breeder Loft Name:{" "}
                  <strong className="text-accent-foreground">
                    {pigeon?.breeder?.loftName || "N/A"}
                  </strong>
                </p>
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
                <span>
                  {pigeon?.story || 
                    "The Blue Thunder pigeon is a blue-gray bird with dark bars, known for its calm nature and strong racing performance. It's popular among experienced breeders and racing enthusiasts."}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Siblings Information */}
        <Card>
          <CardHeader>
            {/* Fix 3: Use proper button component */}
            <button
              variant="ghost"
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
                <div className="overflow-x-auto rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-foreground text-white">
                        <th className="text-left p-3 font-semibold">Name</th>
                        <th className="text-left p-3 font-semibold">Siblings Type</th>
                        <th className="text-left p-3 font-semibold">Ring Number</th>
                        <th className="text-left p-3 font-semibold">Birth Year</th>
                        <th className="text-left p-3 font-semibold">Breeder Rating</th>
                        <th className="text-left p-3 font-semibold">Racer Rating</th>
                        <th className="text-left p-3 font-semibold">Father</th>
                        <th className="text-left p-3 font-semibold">Mother</th>
                        <th className="text-left p-3 font-semibold">Gender</th>
                        <th className="text-left p-3 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {siblings.map((sibling, index) => (
                        <tr key={sibling._id || index} className="border-b bg-background text-white">
                          <td className="p-3 font-medium">
                            {sibling.name || "N/A"}
                          </td>
                          <td className="p-3">{sibling.type || "N/A"}</td>
                          <td className="p-3">{sibling.ringNumber || "N/A"}</td>
                          <td className="p-3">{sibling.birthYear || "N/A"}</td>
                          <td className="p-3">{sibling.breederRating || "N/A"}</td>
                          <td className="p-3">{sibling.racerRating || "N/A"}</td>
                          <td className="p-3">{sibling.father?.ringNumber || "N/A"}</td>
                          <td className="p-3">{sibling.mother?.ringNumber || "N/A"}</td>
                          <td className="p-3">{sibling.gender || "N/A"}</td>
                          <td className="p-3">
                            <Button
                              className="text-white rounded-md"
                              onClick={() => {
                                setSelectedPigeon(sibling);
                                setShowPigeonModal(true);
                              }}
                            >
                              <FaRegEye />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic text-center p-4">No siblings found</p>
              )}
            </CardContent>
          )}
        </Card>

        {/* Race Results */}
        <Card>
          <CardHeader>
            {/* Fix 4: Use proper button component */}
            <button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => setShowRaceResults(!showRaceResults)}
            >
              <div className="flex justify-between items-center w-full">
                <CardTitle className="text-xl font-bold text-accent flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Race Result
                </CardTitle>
                {showRaceResults ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>
          </CardHeader>
          {showRaceResults && (
            <CardContent>
              {pigeon?.results && pigeon.results.length > 0 ? (
                <>
                  <div className="overflow-x-auto rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-foreground text-white">
                        <tr>
                          <th className="text-left p-3 font-semibold">Name</th>
                          <th className="text-left p-3 font-semibold">Date</th>
                          <th className="text-left p-3 font-semibold">Distance</th>
                          <th className="text-left p-3 font-semibold">Total Birds</th>
                          <th className="text-left p-3 font-semibold">Place</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pigeon.results.map((race, index) => (
                          <tr key={race._id || index} className="bg-background text-white">
                            <td className="p-3 font-medium">{race.name || "N/A"}</td>
                            <td className="p-3">
                              {race.date ? moment(race.date).format("DD MMM YYYY") : "N/A"}
                            </td>
                            <td className="p-3">{race.distance || "N/A"}</td>
                            <td className="p-3">{race.total || "N/A"}</td>
                            <td className="p-3">{race.place || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Additional Notes:</strong>
                    </p>
                    <p className="text-sm text-gray-700">
                      {pigeon?.raceNotes || 
                        "The Blue Thunder pigeon is a blue-gray bird with dark bars, known for its calm nature and strong racing performance. It's popular among experienced breeders and racing enthusiasts."}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic text-center p-4">No race results found</p>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      {/* Pigeon Details Modal */}
      <Dialog open={showPigeonModal} onOpenChange={setShowPigeonModal} >
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
              {/* Pigeon Image */}
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
                <h3 className="text-lg font-semibold text-accent">{selectedPigeon.name || "N/A"}</h3>
                <p className="text-sm text-accent">
                  Ring Number: {selectedPigeon.ringNumber || "N/A"}
                </p>
              </div>

              {/* Pigeon Details */}
              <div className="space-y-4 text-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold">Birth Year</p>
                    <p className="text-white">{selectedPigeon.birthYear || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Gender</p>
                    <p className="text-white">{selectedPigeon.gender || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Color</p>
                    <p className="text-white">{selectedPigeon.color || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Country</p>
                    <p className="text-white">{selectedPigeon.country || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Status</p>
                    <p className="text-white">{selectedPigeon.status || "N/A"}</p>
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
                      <p className="text-white">{selectedPigeon.breederRating || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Racer Rating</p>
                      <p className="text-white">{selectedPigeon.racerRating || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Racing Rating</p>
                      <p className="text-white">{selectedPigeon.racingRating || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold">Location</h4>
                  <p className="text-white">{selectedPigeon.location || "N/A"}</p>
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