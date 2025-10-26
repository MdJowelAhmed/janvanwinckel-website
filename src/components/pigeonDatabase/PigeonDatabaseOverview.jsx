import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PigeonDatabaseOverview = ({ data, onStatusFilter, selectedStatus }) => {
  console.log("selected", selectedStatus);
  console.log("onFilter", onStatusFilter);
  // Calculate statistics from the data
  const getStats = () => {
    if (!data?.data?.data)
      return {
        all: 0,
        racing: 0,
        breeding: 0,
        lost: 0,
        sold: 0,
        retired: 0,
        deceased: 0,
      };

    const pigeons = data.data.data;
    console.log("pigeons", pigeons);
    const stats = {
      all: data.data.pagination?.total || pigeons.length,
      racing: 0,
      breeding: 0,
      lost: 0,
      sold: 0,
      retired: 0,
      deceased: 0,
    };

    pigeons.forEach((pigeon) => {
      // Check both status and verified fields for proper categorization
      const status = pigeon.status?.toLowerCase();
      const isVerified = pigeon.verified;

      if (status) {
        switch (status) {
          case "racing":
            stats.racing++;
            break;
          case "breeding":
            stats.breeding++;
            break;
          case "lost":
            stats.lost++;
            break;
          case "sold":
            stats.sold++;
            break;
          case "retired":
            stats.retired++;
            break;
          case "deceased":
            stats.deceased++;
            break;
          default:
            // If no specific status but verified field exists
            if (isVerified) {
              stats.racing++;
            } else {
              stats.breeding++;
            }
            break;
        }
      } else {
        // Fallback to verified field if status is not available
        if (isVerified) {
          stats.racing++;
        } else {
          stats.breeding++;
        }
      }
    });

    return stats;
  };

  const stats = getStats();

  const statItems = [
    {
      label: "All",
      count: stats.all,
      color: "bg-gray-500",
      status: "", // Empty string for "All" filter
      active: !selectedStatus || selectedStatus === "",
    },
    {
      label: "Racing",
      count: stats.racing,
      color: "bg-blue-500",
      status: "racing",
      active: selectedStatus === "racing",
    },
    {
      label: "Breeding",
      count: stats.breeding,
      color: "bg-green-500",
      status: "breeding",
      active: selectedStatus === "breeding",
    },
    {
      label: "Lost",
      count: stats.lost,
      color: "bg-red-500",
      status: "lost",
      active: selectedStatus === "lost",
    },
    {
      label: "Sold",
      count: stats.sold,
      color: "bg-purple-500",
      status: "sold",
      active: selectedStatus === "sold",
    },
    {
      label: "Retired",
      count: stats.retired,
      color: "bg-purple-500",
      status: "Retired",
      active: selectedStatus === "retired",
    },
    {
      label: "Deceased",
      count: stats.deceased,
      color: "bg-orange-500",
      status: "deceased",
      active: selectedStatus === "deceased",
    },
  ];

  const handleStatusClick = (status) => {
    if (onStatusFilter) {
      onStatusFilter(status);
    }
  };

  return (
    <div className="bg-[#44505E] text-white rounded-t-lg">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 gap-x-8 lg:gap-x-12">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleStatusClick(item.status)}
            >
              <div
                className={`w-3 h-2 rounded-r-2xl ${item.color} transition-all duration-200`}
              ></div>
              <Badge
                variant={item.active ? "default" : "secondary"}
                className={`
                  ${
                    item.active
                      ? "bg-white text-slate-700 hover:bg-gray-100 shadow-md"
                      : "bg-slate-600 text-white hover:bg-slate-500"
                  }
                  px-3 py-1 text-sm font-medium transition-all duration-200 cursor-pointer
                  ${item.active ? "ring-2 ring-white ring-opacity-30" : ""}
                `}
              >
                {item.label}
              </Badge>
            </div>
          ))}
        </div>

        {/* Optional: Show active filter indicator */}
        {selectedStatus && (
          <div className="mt-3 pt-3 border-t border-slate-600">
            <p className="text-sm text-slate-300">
              <span className="text-white font-medium">Active Filter:</span>{" "}
              {statItems.find((item) => item.status === selectedStatus)?.label}{" "}
              pigeons
            </p>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default PigeonDatabaseOverview;
