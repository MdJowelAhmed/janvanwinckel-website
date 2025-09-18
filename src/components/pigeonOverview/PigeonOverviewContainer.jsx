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

const PigeonOverviewContainer = () => {
  const { id } = useParams();
  console.log(id);
  const [showSiblings, setShowSiblings] = useState(false);
  const [showRaceResults, setShowRaceResults] = useState(true);
  const { data, isLoading } = useGetSinglePigeonQuery(id);
  const pigeon = data?.data;
  console.log(pigeon);
  console.log(pigeon?.photos[0]);
  console.log(pigeon?.results);

  if (isLoading) <Spinner />;

  return (
    <div className="min-h-screen  md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pigeon Image */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden p-2">
              <div className="aspect-square  flex items-center justify-center">
                <div className="w-full h-full mx-auto   rounded-full ">
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
                {/* <p className="text-sm font-medium">{pigeon?.name}</p> */}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-bold text-[#088395] flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Basic Information
                </CardTitle>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Name :{" "}
                          <strong className="text-accent-foreground">
                            {pigeon?.name}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Ring Number :{" "}
                          <strong className="text-accent-foreground">
                            {" "}
                            {pigeon?.ringNumber}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Birth Year :{" "}
                          <strong className="text-accent-foreground">
                            {pigeon?.birthYear}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Gender :{" "}
                          <strong className="text-accent-foreground">
                            {pigeon?.gender}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Color :{" "}
                          <strong className="text-accent-foreground">
                            {pigeon?.color}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Country :{" "}
                          <strong className="text-accent-foreground">
                            {pigeon?.country}
                          </strong>
                        </p>

                        <p className="text-sm text-gray-600">
                          Status :{" "}
                          <strong className="text-accent-foreground">
                            Racing
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
              <CardTitle className="text-lg text-blue-600">
                Father Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pigeon?.fatherRingId ? (
                <p className="text-gray-500 italic">
                  Father :{" "}
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
              <CardTitle className="text-lg text-blue-600">
                Mother Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pigeon?.motherRingId ? (
                <p className="text-gray-500 italic">
                  Mother :{" "}
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
            <CardTitle className="text-xl font-bold text-blue-600">
              Additional Information
            </CardTitle>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Breeder : <strong className="text-accent">Breeder</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Breeder Quality:{" "}
                  <strong className="text-accent"> Like New</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Location : <strong className="text-accent">Germany</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Father Ring Number :{" "}
                  <strong className="text-accent">
                    {" "}
                    {pigeon?.fatherRingId?.ringNumber || "N/A"}
                  </strong>
                </p>
                <p className="text-sm text-gray-600">
                  Mother Ring Number :{" "}
                  <strong className="text-accent">
                    {pigeon?.motherRingId?.ringNumber || "N/A"}
                  </strong>
                </p>
                <p className="text-sm text-gray-600">
                  Country : <strong className="text-accent">Germany</strong>
                </p>

                <p className="text-sm text-gray-600">
                  Status : <strong className="text-accent">Racing</strong>
                </p>
              </div>
            </div>

            {/* <Separator /> */}

            <div>
              <p className="">
                <strong className="text-accent font-semibold">
                  Your Story :{" "}
                </strong>
                <span>
                  The Blue Thunder pigeon is a blue-gray bird with dark bars,
                  known for its calm nature and strong racing performance. It's
                  popular among experienced breeders and racing enthusiasts.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Siblings Information */}
        <Card>
          <CardHeader>
            <button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => setShowSiblings(!showSiblings)}
            >
              <CardTitle className="text-xl font-bold text-accent  flex items-center justify-between gap-2">
                Siblings Information
                {/* <Baby className="w-5 h-5" /> */}
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-semibold">Name</th>
                      <th className="text-left p-3 font-semibold">Wing Ring</th>
                      <th className="text-left p-3 font-semibold">
                        Extra Position
                      </th>
                      <th className="text-left p-3 font-semibold">
                        Birth Year
                      </th>
                      <th className="text-left p-3 font-semibold">
                        Quality Breeder
                      </th>
                      <th className="text-left p-3 font-semibold">
                        Quality Name
                      </th>
                      <th className="text-left p-3 font-semibold">Father</th>
                      <th className="text-left p-3 font-semibold">Mother</th>
                      <th className="text-left p-3 font-semibold">Gender</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "The Ace",
                        wingRing: "Full Sibling-1 Power Edition",
                        extraPos: "BE 6971204",
                        year: "2021",
                        quality: "Like New",
                        qualityName: "Fast Racer",
                        father: "The Ace",
                        mother: "The Ace",
                        gender: "Cock",
                        status: "",
                      },
                      {
                        name: "The Ace",
                        wingRing: "Half Sibling-1 Power Edition",
                        extraPos: "BE 6971204",
                        year: "2020",
                        quality: "Like New",
                        qualityName: "Fast Racer",
                        father: "The Ace",
                        mother: "The Ace",
                        gender: "Cock",
                        status: "",
                      },
                      {
                        name: "The Ace",
                        wingRing: "Half Sibling-1 Power Edition",
                        extraPos: "BE 6971204",
                        year: "2019",
                        quality: "Like New",
                        qualityName: "Fast Racer",
                        father: "The Ace",
                        mother: "The Ace",
                        gender: "Cock",
                        status: "",
                      },
                    ].map((sibling, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-blue-600 font-medium">
                          {sibling.name}
                        </td>
                        <td className="p-3">{sibling.wingRing}</td>
                        <td className="p-3 text-blue-600">
                          {sibling.extraPos}
                        </td>
                        <td className="p-3">{sibling.year}</td>
                        <td className="p-3">{sibling.quality}</td>
                        <td className="p-3">{sibling.qualityName}</td>
                        <td className="p-3">{sibling.father}</td>
                        <td className="p-3">{sibling.mother}</td>
                        <td className="p-3">{sibling.gender}</td>
                        <td className="p-3">{sibling.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Race Results */}
        <Card>
          <CardHeader>
            <button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => setShowRaceResults(!showRaceResults)}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Race Result
                </CardTitle>
                <div>
                  {" "}
                  {showRaceResults ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            </button>
          </CardHeader>
          {showRaceResults && (
            <CardContent>
              <div className="overflow-x-auto rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-foreground text-white">
                    <tr>
                      <th className="text-left p-3 font-semibold">Name</th>
                      <th className="text-left p-3 font-semibold">Date</th>
                      <th className="text-left p-3 font-semibold">Distance</th>
                      <th className="text-left p-3 font-semibold">
                        Total Birds
                      </th>
                      <th className="text-left p-3 font-semibold">Place</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pigeon?.results?.map((race, index) => (
                      <tr key={index} className="bg-background text-white">
                        <td className="p-3 text-blue-600 font-medium">
                          {race.name}
                        </td>
                        <td className="p-3">
                          {moment(race.date).format("DD MMM YYYY")}
                        </td>
                        <td className="p-3">{race.distance}</td>
                        <td className="p-3">{race.total}</td>
                        <td className="p-3">{race.place}</td>
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
                  The Blue Thunder pigeon is a blue-gray bird with dark bars,
                  known for its calm nature and strong racing performance. It's
                  popular among experienced breeders and racing enthusiasts.
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PigeonOverviewContainer;
