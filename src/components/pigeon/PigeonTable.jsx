import React from "react";
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

const PigeonTable = ({
  data,
  isLoading,
  currentPage,
  onPageChange,
  onEdit,
}) => {
  const router = useRouter();
  const [deletePigeon] = useDeletePigeonMutation();

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!data?.data?.data?.length) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-gray-500 text-lg">No pigeons found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pigeons = data.data.data;
  const pagination = data.data.pagination;

  // const getStatusColor = (status) => {
  //   switch (status?.toLowerCase()) {
  //     case "active":
  //       return "bg-green-100 text-green-800";
  //     case "racing":
  //       return "bg-blue-100 text-blue-800";
  //     case "breeding":
  //       return "bg-purple-100 text-purple-800";
  //     case "sold":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "lost":
  //       return "bg-red-100 text-red-800";
  //     case "deceased":
  //       return "bg-gray-100 text-gray-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  const getRatingStars = (rating) => {
    const stars = Math.floor(rating / 20); // Convert to 5-star scale
    return "★".repeat(stars) + "☆".repeat(5 - stars);
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
    if (
      window.confirm(
        "Are you sure you want to delete this pigeon? This action cannot be undone."
      )
    ) {
      try {
        await deletePigeon(pigeonId).unwrap();
        // Optionally show success message
      } catch (error) {
        console.error("Failed to delete pigeon:", error);
        alert("Failed to delete pigeon. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <idv>
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-lg mb-4">
            <Table>
              <TableHeader className="bg-background py-6">
                <TableRow className="bg-foreground py-5">
                  {/* <TableHead className="text-white w-12 ">
                    <Checkbox className="border-slate-400" />
                  </TableHead> */}
                  <TableHead className="text-white">Image</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Country</TableHead>
                  <TableHead className="text-white">Breeder</TableHead>
                  <TableHead className="text-white">Ring Number</TableHead>
                  <TableHead className="text-white">Bird Year</TableHead>
                  <TableHead className="text-white">Quality Breeder</TableHead>
                  <TableHead className="text-white">Quality Racer</TableHead>
                  <TableHead className="text-white">Racing Rating</TableHead>
                  <TableHead className="text-white">Pattern</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Gender</TableHead>
                  {/* <TableHead className="text-white">Rating</TableHead> */}
                  <TableHead className="text-white">Color</TableHead>
                  <TableHead className="text-white">Location</TableHead>
                  <TableHead className="text-white w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pigeons.map((pigeon, index) => (
                  <TableRow
                    key={pigeon._id}
                    className="bg-background hover:bg-foreground text-white"
                  >
                    {/* <TableCell>
                      <Checkbox />
                    </TableCell> */}

                    <TableCell>
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={
                            getImageUrl(pigeon.photos[0]) ||
                            "/placeholder-pigeon.jpg"
                          }
                          alt={pigeon.name}
                        />
                        <AvatarFallback className="bg-blue-100 text-[#3AB27F]">
                          {pigeon.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    <TableCell className="font-medium text-[#3AB27F]">
                      {pigeon.name}
                    </TableCell>
                    <TableCell>
                      <div className="text-[#3AB27F]">
                        {pigeon.country.slice(0, 3)}
                      </div>
                    </TableCell>

                    <TableCell>
                      {pigeon?.breeder?.breederName || "N/A"}
                    </TableCell>

                    <TableCell className="font-mono text-sm">
                      {pigeon.ringNumber}
                    </TableCell>

                    <TableCell>{pigeon.birthYear}</TableCell>
                    <TableCell>{pigeon.breederRating}</TableCell>
                    <TableCell>{pigeon.racerRating}</TableCell>

                    {/* <TableCell>
                      <div className="text-sm">
                        <div>Sire: {pigeon.fatherRingId?.name || 'N/A'}</div>
                        <div className="text-gray-500">Ring: {pigeon.fatherRingId?.ringNumber || 'N/A'}</div>
                      </div>
                    </TableCell> */}

                    {/* <TableCell>
                      <div className="text-sm">
                        <div>Dam: {pigeon.motherRingId?.name || 'N/A'}</div>
                        <div className="text-gray-500">Ring: {pigeon.motherRingId?.ringNumber || 'N/A'}</div>
                      </div>
                    </TableCell> */}

                    <TableCell className="text-[#3AB27F]">
                      {pigeon.racingRating || pigeon.racerRating || 0}
                    </TableCell>

                    <TableCell>{pigeon.pattern}</TableCell>

                    <TableCell className="text-[#3AB27F]">
                      {pigeon.verified ? "Racing" : "Breeding"}
                    </TableCell>

                    <TableCell className="text-[#3AB27F]">
                      {pigeon.gender}
                    </TableCell>

                    {/* <TableCell>
                      <div className="text-yellow-500">
                        {getRatingStars(pigeon.breederRating || pigeon.racherRating || 0)}
                      </div>
                    </TableCell> */}

                    <TableCell>{pigeon.color}</TableCell>

                    <TableCell>{pigeon.location}</TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => onEdit(pigeon._id)}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Pigeon
                          </DropdownMenuItem>
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
        </CardContent>
      </idv>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 bg-white  rounded-lg">
          <div className="flex items-center text-sm text-white">
            Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
            {pagination.total} entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="h-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, pagination.totalPage) },
                (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className={`pigeon-pagination-button ${
                        page === currentPage ? "bg-background text-white" : ""
                      }`}
                    >
                      {page}
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= pagination.totalPage}
              className="h-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
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

