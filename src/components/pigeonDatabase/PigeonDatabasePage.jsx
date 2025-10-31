"use client";
import React, { useState } from "react";
// import PigeonOverview from "./PigeonOverview";
// import PigeonFilters from "./PigeonFilters";
// import PigeonTable from "./PigeonTable";
import { Button } from "@/components/ui/button";
import { Plus, FileDown, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetPigeonPackagesQuery } from "@/redux/featured/pigeon/pigeonApi";
import { Badge } from "@/components/ui/badge";
import PigeonDatabaseOverview from "./PigeonDatabaseOverview";
import PigeonDatabaseFilter from "./PigeonDatabaseFilter";
import PigeonDatabaseTable from "./PigeonDatabaseTable";

const PigeonDatabasePage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // New state for status filter

  // Build query parameters
  const queryParams = [
    { name: "page", value: currentPage },
    { name: "limit", value: 10000 },
    ...(searchTerm ? [{ name: "searchTerm", value: searchTerm }] : []),
    ...(selectedStatus ? [{ name: "status", value: selectedStatus }] : []), // Add status filter
    ...filters,
  ];

  const {
    data: pigeonData,
    isLoading,
    error,
  } = useGetPigeonPackagesQuery(queryParams);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // New function to handle status filtering
  const handleStatusFilter = (status) => {
    if (selectedStatus === status) {
      // If clicking the same status, remove filter
      setSelectedStatus("");
    } else {
      // Set new status filter
      setSelectedStatus(status);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Function to clear status filter
  const clearStatusFilter = () => {
    setSelectedStatus("");
    setCurrentPage(1);
  };

//   const handleAddPigeon = () => {
//     router.push("/add-pigeon");
//   };

  const handleEditPigeon = (pigeonId) => {
    router.push(`/add-pigeon?edit=${pigeonId}`);
  };

//   const handleExportPDF = () => {
//     if (!pigeonData?.data?.data?.length) {
//       alert("No data available to export");
//       return;
//     }

//     // Check if jspdf is available
//     if (typeof window !== "undefined") {
//       // Dynamic import for jspdf
//       import("jspdf").then((jsPDFModule) => {
//         const jsPDF = jsPDFModule.default;
//         import("jspdf-autotable").then((autoTableModule) => {
//           const autoTable = autoTableModule.default; // <-- এখানে ধরতে হবে
//           try {
//             const doc = new jsPDF();

//             // Add title
//             doc.setFontSize(18);
//             doc.text("Pigeon Data Export", 14, 22);
//             doc.setFontSize(11);
//             doc.setTextColor(100);

//             // Get table data
//             const tableColumn = [
//               "Name",
//               "Country",
//               "Breeder",
//               "Ring Number",
//               "Bird Year",
//               "Status",
//               "Gender",
//             ];

//             const tableRows = [];

//             pigeonData.data.data.forEach((pigeon) => {
//               tableRows.push([
//                 pigeon.name || "-",
//                 pigeon.country || "-",
//                 pigeon.breeder?.breederName || "-",
//                 pigeon.ringNumber || "-",
//                 pigeon.birthYear || "-",
//                 pigeon.status || "-",
//                 pigeon.gender || "-",
//               ]);
//             });

//             // এখানে direct call করতে হবে
//             autoTable(doc, {
//               head: [tableColumn],
//               body: tableRows,
//               startY: 30,
//               theme: "striped",
//               headStyles: {
//                 fillColor: [58, 178, 127],
//                 textColor: [255, 255, 255],
//               },
//               alternateRowStyles: {
//                 fillColor: [240, 240, 240],
//               },
//             });

//             // Add date
//             const date = new Date();
//             doc.setFontSize(10);
//             doc.text(
//               `Generated on ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
//               14,
//               doc.lastAutoTable.finalY + 10
//             );

//             doc.save(`pigeon-data-${date.toISOString().split("T")[0]}.pdf`);
//           } catch (error) {
//             console.error("Error generating PDF:", error);
//             alert(
//               "Error generating PDF. Please make sure jspdf and jspdf-autotable are installed."
//             );
//           }
//         });
//       });
//     }
//   };

//   const handleExportExcel = () => {
//     if (!pigeonData?.data?.data?.length) {
//       alert("No data available to export");
//       return;
//     }

//     // Check if xlsx is available
//     if (typeof window !== "undefined") {
//       // Dynamic import for xlsx
//       import("xlsx")
//         .then((XLSX) => {
//           try {
//             // Prepare the data
//             const worksheet = XLSX.utils.json_to_sheet(
//               pigeonData.data.data.map((pigeon) => ({
//                 Name: pigeon.name || "-",
//                 Country: pigeon.country || "-",
//                 Breeder: pigeon.breeder?.breederName || "-",
//                 "Ring Number": pigeon.ringNumber || "-",
//                 "Bird Year": pigeon.birthYear || "-",
//                 "Quality Breeder": pigeon.breederRating || "-",
//                 "Quality Racer": pigeon.racerRating || "-",
//                 "Racing Rating": pigeon.racingRating || "-",
//                 Pattern: pigeon.pattern || "-",
//                 Status: pigeon.status || "-",
//                 Gender: pigeon.gender || "-",
//                 Color: pigeon.color || "-",
//                 Location: pigeon.location || "-",
//               }))
//             );

//             // Create workbook
//             const workbook = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(workbook, worksheet, "Pigeons");

//             // Generate Excel file
//             const date = new Date().toISOString().split("T")[0];
//             XLSX.writeFile(workbook, `pigeon-data-${date}.xlsx`);
//           } catch (error) {
//             console.error("Error generating Excel:", error);
//             alert(
//               "Error generating Excel file. Please make sure xlsx is installed."
//             );
//           }
//         })
//         .catch((error) => {
//           console.error("Error loading xlsx:", error);
//           alert("Please install xlsx by running: npm install xlsx");
//         });
//     }
//   };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading pigeons: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pigeon Database</h1>
          <p className="text-gray-600 mt-1">Manage Your Pigeon Collection</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* <Button
            onClick={handleAddPigeon}
            className="bg-accent-foreground hover:bg-accent-foreground text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Pigeon
          </Button> */}

          {/* <Button
            variant="outline"
            onClick={handleExportPDF}
            className="bg-primary text-white hover:text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="bg-primary text-white hover:text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Export as Excel
          </Button> */}
        </div>
      </div>

      {/* Active Status Filter Display */}
      {/* {selectedStatus && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-800">Active Filter:</span>
          <Badge 
            variant="secondary"
            className="bg-blue-100 text-blue-800 border-blue-300"
          >
            Status: {selectedStatus}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={clearStatusFilter}
            className="h-6 w-6 p-0 hover:bg-blue-100"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )} */}

      <div>
        {/* Overview Stats */}
        <PigeonDatabaseOverview
          data={pigeonData}
          onStatusFilter={handleStatusFilter}
          selectedStatus={selectedStatus}
        />
        {/* Filters */}
        <PigeonDatabaseFilter
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          searchTerm={searchTerm}
        />
      </div>

      {/* Pigeon Table with Status Filter Handler */}
      <PigeonDatabaseTable
        data={pigeonData}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEdit={handleEditPigeon}
        onStatusFilter={handleStatusFilter} // Pass the status filter handler
        selectedStatus={selectedStatus} // Pass selected status for highlighting
      />
    </div>
  );
};

export default PigeonDatabasePage;
