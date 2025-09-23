"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
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
import { User, Calendar, Crown, Award, Info, Download } from "lucide-react";
import { useGetPigeonPedigreeChartDataQuery } from "@/redux/featured/pigeon/pigeonApi";
import { convertBackendToExistingFormat } from "./PigeonData";
import { useParams } from "next/navigation";
import Spinner from "@/app/(commonLayout)/Spinner";
import { getCode } from "country-list";
import { WinnerPedigree } from "../share/svg/howItWorkSvg";
import Image from "next/image";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PigeonNode = ({ data }) => {
  const countryCode = data.country ? getCode(data.country) : null;
  console.log(data.gender);
  const getGenderIcon = (gender) => {
    return gender === "Cock" ? "♂" : "♀";
  };

  const getGenderColor = (gender) => {
    return gender === "male" ? "bg-blue-500" : "bg-pink-500";
  };

  const getGenerationColor = (generation) => {
    switch (generation) {
      case 0:
        return "border-black"; // Subject
      case 1:
        return "border-black"; // Parents (2)
      case 2:
        return "border-black"; // Grandparents (4)
      case 3:
        return "border-black"; // Great-grandparents (8)
      case 4:
        return "border-black"; // Great-great-grandparents (16)
      default:
        return "border-black";
    }
  };

  const getCardSize = (generation) => {
    switch (generation) {
      case 0:
        return "w-[300px] h-[700px]"; // Subject - largest
      case 1:
        return "w-[300px] h-[700px]"; // Parents
      case 2:
        return "w-[300px] h-[400px]"; // Grandparents
      case 3:
        return "w-[300px] h-[200px]"; // Great-grandparents
      case 4:
        return "w-[300px] h-[100px]"; // Great-great-grandparents - smallest
      default:
        return "w-[300px] h-24";
    }
  };

  return (
    <div
      style={{ backgroundColor: data.color }}
      className={`${getCardSize(data?.generation)} 
        
        border-b-8 border-r-10 border-black
          text-white rounded-none transition-all duration-300 px-4 py-2
          ${getGenerationColor(data?.generation)} border`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-slate-400"
      />
      <div className="flex items-center justify-between ">
        {countryCode && (
          <div className="flex items-center gap-1">
            <img
              src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
              alt={data.country}
              className="w-6 h-5 rounded-sm"
            />
            <p className="text-black">{countryCode}</p>
          </div>
        )}

        {/* <Crown className="w-3 h-3 text-amber-600" /> */}
        {data.birthYear && (
          <span className="text-black">
            {data.birthYear.toString().slice(-2)}
          </span>
        )}
        {data.ringNumber && (
          <span className=" font-bold text-[#C33739]">{data.ringNumber}</span>
        )}
        {data.gender && (
          <span className="text-black text-xl">
            {getGenderIcon(data.gender)}
          </span>
        )}
        <Image
          src="/assests/Letter-P.png"
          alt="Letter P"
          width={24}
          height={24}
          className="w-6 h-6"
        />
        <Image
          src="/assests/Gold-cup.png"
          alt="Letter P"
          width={30}
          height={30}
          className="w-7 h-7"
        />

        {/* <WinnerPedigree /> */}
      </div>

      <div className="">
        <div className="flex items-center justify-start gap-2 space-y-2">
          {data.name && (
            <h3 className="font-bold text-black text-xl truncate">
              {data.name}
            </h3>
          )}
        </div>
        <div className="flex items-center justify-start gap-2">
          {" "}
          {data.owner && (
            <div className="flex items-center gap-2 text-xl  italic text-black">
              <User className="w-3 h-3" />
              <span className="truncate">{data.owner}</span>
            </div>
          )}
          <Image
            src="/assests/Letter-B.png"
            alt="Letter P"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </div>

        {data.description && (
          <div className="">
            <p className="text-sm text-slate-700">{data.description}</p>
          </div>
        )}
        {data.colorName && (
          <div className="">
            <p className="text-sm text-slate-700"> color : {data.colorName}</p>
          </div>
        )}
        {data.achievements && (
          <div className="flex  gap-2">
            <p className="text-xs text-black">Results : </p>
            <Image
              src="/assests/Gold-tropy.png"
              alt="Letter P"
              width={30}
              height={30}
              className="w-7 h-7"
            />
            <p className="text-xs text-black">{data.achievements}</p>
          </div>
        )}
        {/* {data.position && (
            <span variant="secondary" className="text-xs px-1 text-black">
              {data.position}
            </span>
          )} */}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-slate-400"
      />
    </div>
  );
};

const nodeTypes = {
  pigeonNode: PigeonNode,
};

export default function PigeonPedigreeChart() {
  const { id } = useParams();
  const { data: pedigreeData, isLoading } =
    useGetPigeonPedigreeChartDataQuery(id);
  const chartRef = useRef(null);

  const { nodes: dynamicNodes, edges: dynamicEdges } = useMemo(() => {
    return convertBackendToExistingFormat(pedigreeData);
  }, [pedigreeData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(dynamicNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(dynamicEdges);

  useEffect(() => {
    setNodes(dynamicNodes);
    setEdges(dynamicEdges);
  }, [dynamicNodes, dynamicEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Excel Export Function
  const exportToExcel = useCallback(() => {
    try {
      // Prepare data for Excel
      const excelData = nodes.map((node, index) => ({
        'Serial No': index + 1,
        'Name': node.data.name || 'N/A',
        'Ring Number': node.data.ringNumber || 'N/A',
        'Gender': node.data.gender || 'N/A',
        'Birth Year': node.data.birthYear || 'N/A',
        'Owner': node.data.owner || 'N/A',
        'Country': node.data.country || 'N/A',
        'Color': node.data.colorName || 'N/A',
        'Generation': node.data.generation !== undefined ? node.data.generation : 'N/A',
        'Achievements': node.data.achievements || 'N/A',
        'Description': node.data.description || 'N/A'
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 10 }, // Serial No
        { wch: 20 }, // Name
        { wch: 15 }, // Ring Number
        { wch: 10 }, // Gender
        { wch: 12 }, // Birth Year
        { wch: 20 }, // Owner
        { wch: 15 }, // Country
        { wch: 15 }, // Color
        { wch: 12 }, // Generation
        { wch: 30 }, // Achievements
        { wch: 40 }  // Description
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Pigeon Pedigree');

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `pigeon-pedigree-${currentDate}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
      
      console.log('Excel export completed successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting to Excel. Please try again.');
    }
  }, [nodes]);

  // PDF Export Function
  const exportToPDF = useCallback(async () => {
    try {
      if (!chartRef.current) {
        alert('Chart not ready for export. Please try again.');
        return;
      }

      // Show loading state
      const exportButton = document.querySelector('[data-export-pdf]');
      if (exportButton) {
        exportButton.textContent = 'Exporting...';
        exportButton.disabled = true;
      }

      // Configure html2canvas for better quality
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: chartRef.current.scrollWidth,
        height: chartRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Create PDF in landscape mode for better fit
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });

      // Add the image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `pigeon-pedigree-chart-${currentDate}.pdf`;
      
      // Save PDF
      pdf.save(filename);
      
      console.log('PDF export completed successfully');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Error exporting to PDF. Please try again.');
    } finally {
      // Reset button state
      const exportButton = document.querySelector('[data-export-pdf]');
      if (exportButton) {
        exportButton.textContent = 'Export as PDF';
        exportButton.disabled = false;
      }
    }
  }, []);

  const defaultViewport = { x: 0, y: 0, zoom: 0.8 };
  
  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mt-12">
        <div className="max-w-2xl">
          <h2 className="text-black font-bold text-2xl">
            Pigeon pedigree chart
          </h2>
          <p className="text-black">
            The Pedigree Chart displays your pigeon's lineage across multiple
            generations, showing key details like name, ring number, and
            birthdate. It helps you track breeding relationships and plan future
            pairings.
          </p>
        </div>
        <div className="flex gap-5">
          <Button 
            onClick={exportToExcel}
            className="bg-primary text-white hover:text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export as Excel
          </Button>
          <Button 
            onClick={exportToPDF}
            data-export-pdf
            className="bg-primary text-white hover:text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export as PDF
          </Button>
        </div>
      </div>
      <div 
        ref={chartRef}
        className="w-full h-[1800px] flex justify-start items-center"
      >
        {/* --- ReactFlow (now dynamic) --- */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultViewport={defaultViewport}
          fitView
          attributionPosition="bottom-right"
          className="bg-transparent h-full py-16"
          minZoom={0.5}
          maxZoom={1}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
        >
          {/* <Background variant="dots" gap={25} size={1.5} color="#FFFFFF" /> */}
        </ReactFlow>
      </div>
    </div>
  );
}