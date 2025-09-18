// PigeonNode.jsx - কাস্টম নোড কম্পোনেন্ট

import React from "react";
import { Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Calendar, Crown, Award, Info } from "lucide-react";

// Custom Node Component for Pigeon Pedigree
const PigeonNode = ({ data }) => {
  const getGenderIcon = (gender) => {
    return gender === "male" ? "♂" : "♀";
  };

  const getGenderColor = (gender) => {
    return gender === "male" ? "bg-blue-500" : "bg-pink-500";
  };

  const getGenerationColor = (generation) => {
    switch (generation) {
      case 0:
        return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400"; // Subject
      case 1:
        return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300"; // Parents (2)
      case 2:
        return "bg-gradient-to-br from-green-50 to-green-100 border-green-300"; // Grandparents (4)
      case 3:
        return "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300"; // Great-grandparents (8)
      case 4:
        return "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300"; // Great-great-grandparents (16)
      default:
        return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300";
    }
  };

  const getCardSize = (generation) => {
    switch (generation) {
      case 0:
        return "w-72 h-96"; // Subject - largest
      case 1:
        return "w-64 h-36"; // Parents
      case 2:
        return "w-56 h-32"; // Grandparents
      case 3:
        return "w-48 h-28"; // Great-grandparents
      case 4:
        return "w-40 h-24"; // Great-great-grandparents - smallest
      default:
        return "w-40 h-24";
    }
  };

  return (
    <Card
      className={`${getCardSize(
        data.generation
      )} shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${getGenerationColor(
        data.generation
      )} border-2`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-slate-400"
      />

      <CardHeader className="pb-2 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-3 h-3 text-amber-600" />
            <h3 className="font-bold text-xs text-gray-900 truncate">
              {data.name}
            </h3>
          </div>
          <Badge
            className={`${getGenderColor(
              data.gender
            )} text-white text-xs px-1 py-0.5`}
          >
            {getGenderIcon(data.gender)}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs px-1">
            Gen {data.generation}
          </Badge>
          <Badge variant="secondary" className="text-xs px-1">
            {data.position}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 p-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <User className="w-3 h-3" />
            <span className="truncate">{data.owner}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{data.birthYear}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className={`w-3 h-3 rounded-full ${data.color}`}></div>
            <span className="truncate">{data.colorName}</span>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-full text-xs mt-1 p-0"
              >
                <Info className="w-3 h-3 mr-1" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-600" />
                  {data.name}
                  <Badge
                    className={`${getGenderColor(data.gender)} text-white`}
                  >
                    {getGenderIcon(data.gender)}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold">Owner</p>
                    <p className="text-xs text-gray-600">{data.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Birth Year</p>
                    <p className="text-xs text-gray-600">{data.birthYear}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold">Position</p>
                  <p className="text-xs text-gray-600">{data.position}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold">Color</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${data.color}`}></div>
                    <p className="text-xs text-gray-600">{data.colorName}</p>
                  </div>
                </div>

                {data.achievements && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      <p className="text-sm font-semibold">Achievements</p>
                    </div>
                    <p className="text-xs text-gray-600">{data.achievements}</p>
                  </div>
                )}

                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-700">{data.description}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-slate-400"
      />
    </Card>
  );
};

export default PigeonNode;