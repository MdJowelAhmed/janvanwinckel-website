import React, { useRef, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Edit,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  GitBranch,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useDeletePigeonMutation } from "@/redux/featured/pigeon/pigeonApi";
import { getImageUrl } from "../share/imageUrl";
import { getCode } from "country-list";
import Image from "next/image";
import Swal from "sweetalert2";
import { DeleteConfirm } from "../share/deleteConfimation";
import { useMyProfileQuery } from "@/redux/featured/auth/authApi";
import SyncHorizontalScroll from "../share/Scrollbar";

const PigeonTable = ({
  data,
  isLoading,
  currentPage,
  onPageChange,
  onEdit,
}) => {
  const router = useRouter();
  const [deletePigeon] = useDeletePigeonMutation();
  const { data: userData } = useMyProfileQuery();
  const userId = userData?._id;
console.log(data)
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  // Grab scroll functionality
  const tableContainerRef = useRef(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (isGrabbing) {
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
    } else {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    return () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isGrabbing]);

  const pigeons = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  // Sort pigeons
// Sort pigeons
  const sortedPigeons = React.useMemo(() => {
    if (!pigeons || pigeons.length === 0) {
      return [];
    }
    
    let sortedData = [...pigeons];
    
    if (sortConfig.key && sortConfig.direction) {
      sortedData.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === "name") {
          aValue = (a.name?.toLowerCase() || "").trim();
          bValue = (b.name?.toLowerCase() || "").trim();
        } else if (sortConfig.key === "birthYear") {
          aValue = parseInt(a.birthYear) || 0;
          bValue = parseInt(b.birthYear) || 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortedData;
  }, [pigeons, sortConfig.key, sortConfig.direction]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!pigeons.length) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-gray-500 text-lg">No pigeons found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render sort icon
  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 ml-1 inline" />;
    }
    if (sortConfig.direction === "asc") {
      return <ArrowUp className="h-4 w-4 ml-1 inline" />;
    }
    if (sortConfig.direction === "desc") {
      return <ArrowDown className="h-4 w-4 ml-1 inline" />;
    }
    return <ArrowUpDown className="h-4 w-4 ml-1 inline" />;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination?.totalPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handleView = (pigeonId) => {
    router.push(`/pigeon-overview/${pigeonId}`);
  };

  const handlePedigree = (pigeonId) => {
    router.push(`/pedigree-chart/${pigeonId}`);
  };

  const handleDelete = async (pigeonId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#37B7C3",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deletePigeon(pigeonId).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "Pigeon deleted successfully.",
          icon: "success",
          confirmButtonColor: "#37B7C3",
        });
      } catch (error) {
        console.error("Failed to delete pigeon:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete pigeon. Please try again.",
          icon: "error",
          confirmButtonColor: "#37B7C3",
        });
      }
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    if (!fileUrl) return;

    try {
      const fullUrl = getImageUrl(fileUrl);
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to download file. Please try again.",
        icon: "error",
        confirmButtonColor: "#37B7C3",
      });
    }
  };

  const getFileName = (url, prefix) => {
    if (!url) return "";
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return `${prefix}_${filename}`;
  };

  return (
    <div className="space-y-4">
      <div>
        <CardContent className="p-0">
          <div>
            <SyncHorizontalScroll
              containerClassName="overflow-x-auto border rounded-lg shadow-md bg-red-600 custom-scrollbar hide-scrollbar cursor-grab"
              watch={sortedPigeons.length}
            >
              <div
                style={{
                  minWidth: sortedPigeons.length > 0 ? "max-content" : "100%",
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
                <Table
                  scroll={
                    sortedPigeons.length > 0 ? { x: "max-content" } : undefined
                  }
                >
                  <TableHeader className="bg-foreground hover:bg-foreground py-6">
                    <TableRow className="bg-foreground py-5">
                      <TableHead className="text-white">Image</TableHead>
                      <TableHead
                        className="text-white cursor-pointer hover:bg-foreground/80 select-none"
                        onClick={() => handleSort("name")}
                      >
                        Name {renderSortIcon("name")}
                      </TableHead>
                      <TableHead className="text-white">Country</TableHead>
                      <TableHead className="text-white">Breeder</TableHead>
                      <TableHead className="text-white">Ring Number</TableHead>
                      <TableHead
                        className="text-white cursor-pointer hover:bg-foreground/80 select-none"
                        onClick={() => handleSort("birthYear")}
                      >
                        Birth Year {renderSortIcon("birthYear")}
                      </TableHead>
                      <TableHead className="text-white">
                        Breeder Rating
                      </TableHead>
                      <TableHead className="text-white">
                        Racing Rating
                      </TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Gender</TableHead>
                      <TableHead className="text-white">Color</TableHead>
                      <TableHead className="text-white">Location</TableHead>
                      <TableHead className="text-white w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPigeons.map((pigeon, index) => (
                      <TableRow
                        key={pigeon._id}
                        className="bg-background hover:bg-foreground text-white"
                      >
                        <TableCell>
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={
                                getImageUrl(
                                  pigeon.pigeonPhoto ||
                                    pigeon?.eyePhoto ||
                                    pigeon?.pedigree ||
                                    pigeon?.DNAPhoto ||
                                    pigeon?.ownershipPhoto
                                ) || "/placeholder-pigeon.jpg"
                              }
                              alt={pigeon.name}
                            />
                            <AvatarFallback className="bg-blue-100 text-[#3AB27F]">
                              {pigeon.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>

                        <TableCell
                          onClick={() => handlePedigree(pigeon._id)}
                          className="font-medium cursor-pointer text-[#3AB27F]"
                        >
                          {pigeon.name}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const countryCode = pigeon.country
                              ? getCode(pigeon.country)
                              : null;
                            return (
                              countryCode && (
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
                                    alt={pigeon.country}
                                    width={24}
                                    height={18}
                                    className="w-5 h-4 rounded-sm"
                                  />
                                  <p className="text-[#B0B6A4]">{countryCode}</p>
                                </div>
                              )
                            );
                          })()}
                        </TableCell>

                        <TableCell>
                          {pigeon?.breeder?.loftName || "N/A"}
                        </TableCell>

                        <TableCell className="font-mono text-sm">
                          {pigeon.ringNumber}
                        </TableCell>

                        <TableCell className="text-[#B0B6A4]">
                          {pigeon.birthYear}
                        </TableCell>
                        <TableCell>{pigeon.breederRating}</TableCell>

                        <TableCell className="">
                          {pigeon.racingRating || pigeon.racerRating || 0}
                        </TableCell>

                        <TableCell className="text-[#3AB27F]">
                          {pigeon.status}
                        </TableCell>

                        <TableCell className="text-[#3AB27F]">
                          {pigeon.gender}
                        </TableCell>

                        <TableCell>{pigeon.color}</TableCell>

                        <TableCell>
                          {pigeon.location && pigeon.location.length > 20
                            ? pigeon.location.slice(0, 20) + "..."
                            : pigeon.location}
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-accent"
                              >
                                <MoreHorizontal className="h-4 w-4 text-white font-bold hover:text-white" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {pigeon?.user?._id === userId && (
                                <DropdownMenuItem
                                  onClick={() => onEdit(pigeon._id)}
                                  className="cursor-pointer"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Pigeon
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem
                                onClick={() => handleView(pigeon._id)}
                                className="cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handlePedigree(pigeon._id)}
                                className="cursor-pointer"
                              >
                                <GitBranch className="h-4 w-4 mr-2" />
                                View Pedigree
                              </DropdownMenuItem>

                              {pigeon.pigeonPhoto && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDownload(
                                      pigeon.pigeonPhoto,
                                      getFileName(
                                        pigeon.pigeonPhoto,
                                        "pigeon_photo"
                                      )
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Pigeon Photo
                                </DropdownMenuItem>
                              )}

                              {pigeon.eyePhoto && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDownload(
                                      pigeon.eyePhoto,
                                      getFileName(pigeon.eyePhoto, "eye_photo")
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Eye Photo
                                </DropdownMenuItem>
                              )}

                              {pigeon.ownershipPhoto && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDownload(
                                      pigeon.ownershipPhoto,
                                      getFileName(
                                        pigeon.ownershipPhoto,
                                        "ownership_photo"
                                      )
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Ownership
                                </DropdownMenuItem>
                              )}

                              {pigeon.pedigreePhoto && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDownload(
                                      pigeon.pedigreePhoto,
                                      getFileName(
                                        pigeon.pedigreePhoto,
                                        "pedigree"
                                      )
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Pedigree Photo/PDF
                                </DropdownMenuItem>
                              )}

                              {pigeon.DNAPhoto && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDownload(
                                      pigeon.DNAPhoto,
                                      getFileName(pigeon.DNAPhoto, "dna")
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  DNA Photo/PDF
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem
                                onClick={() => handleDelete(pigeon._id)}
                                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Pigeon
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SyncHorizontalScroll>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

const TableSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default PigeonTable;