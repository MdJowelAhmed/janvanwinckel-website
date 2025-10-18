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
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useMyProfileQuery } from "@/redux/featured/auth/authApi";

const PigeonNode = ({ data }) => {
  const countryCode = data.country ? getCode(data.country) : null;
  console.log(data.achievements);
  console.log("data.verified:", data.verified);
  // console.log(data.colorName);
  console.log("data?.iconic:", data?.iconic);
  console.log("data?.breederVerified:", data?.breederVerified);
  const getGenderIcon = (gender) => {
    if (gender === "Cock") return "♂";
    if (gender === "Hen") return "♀";
    if (gender === "Unspecified") return "⚪";
    return "⚪"; // default fallback
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
        return "w-[270px] h-[700px]"; // Subject - largest
      case 1:
        return "w-[270px] h-[700px]"; // Parents
      case 2:
        return "w-[270px] h-[510px]"; // Grandparents
      case 3:
        return "w-[270px] h-[250px]"; // Great-grandparents
      case 4:
        return "w-[270px] h-[120px]"; // Great-great-grandparents - smallest
      default:
        return "w-[270px] h-24";
    }
  };

  return (
    <div
      style={{ backgroundColor: data.color }}
      className={`${getCardSize(data?.generation)} 
        
        border-b-8 border-r-10 border-black
          text-white rounded-none transition-all duration-300 px-2 py-2
          ${getGenerationColor(data?.generation)} border`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-slate-400"
      />
      <div className="flex items-center justify-between ">
        <div className="flex items-center justify-center gap-1">
          {countryCode && (
            <div className="flex items-center gap-1">
              <Image
                src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
                alt={data.country}
                width={24}
                height={18}
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
        </div>
        <div className="flex items-center justify-center gap-1">
          {" "}
          {data.gender && (
            <span className="text-black text-xl">
              {getGenderIcon(data.gender)}
            </span>
          )}
          {data.verified && (
            <Image
              src="/assests/Letter-P.png"
              alt="Letter P"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          )}
          {data?.iconic && (
            <Image
              src="/assests/Gold-cup.png"
              alt="Letter P"
              width={30}
              height={30}
              className="w-6 h-6"
            />
          )}
        </div>

        {/* <WinnerPedigree /> */}
      </div>

      <div className="">
        <div className="flex items-center justify-start gap-2 space-y-2">
          {data.name && (
            <h3 className="font-bold text-black  truncate ">{data.name}</h3>
          )}
        </div>
        <div className="flex items-center justify-start gap-2 ">
          {" "}
          {data.owner && (
            <div className="flex items-center gap-2 text-xl  italic text-black ">
              {/* <User className="w-3 h-3" /> */}
              <span className="truncate ">{data.owner}</span>
            </div>
          )}
          {data?.breederVerified && (
            <div className="flex items-center gap-2 text-xl  italic text-black ">
              <Image
                src="/assests/Letter-B.png"
                alt="Letter P"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
          )}
        </div>

        {data.description && (
          <div className="">
            <p className="text-sm text-slate-700">
              {data?.description?.slice(0, 650)}
            </p>
          </div>
        )}
        {data.colorName && (
          <div className="">
            <p className="text-sm text-slate-700"> {data.colorName}</p>
          </div>
        )}
        {data.achievements && (
          <div className="flex items-start gap-1">
            <p className="text-xs text-black">Results:</p>
            <Image
              src="/assests/Gold-tropy.png"
              alt="Letter P"
              width={24}
              height={24}
              className="w-6 h-6 mt-[2px]"
            />
            <p className="text-xs text-black whitespace-pre-line">
              {data.achievements}
            </p>
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
  const { data: profileData } = useMyProfileQuery();
  console.log("pedigree", profileData?.role);
  const role = profileData?.role;
  const { data: pedigreeData, isLoading } =
    useGetPigeonPedigreeChartDataQuery(id);
  // console.log("pedigreeData", pedigreeData);
  const chartRef = useRef(null);

  const { nodes: dynamicNodes, edges: dynamicEdges } = useMemo(() => {
    return convertBackendToExistingFormat(pedigreeData, role);
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
        "Serial No": index + 1,
        Name: node.data.name || "N/A",
        "Ring Number": node.data.ringNumber || "N/A",
        Gender: node.data.gender || "N/A",
        "Birth Year": node.data.birthYear || "N/A",
        Owner: node.data.owner || "N/A",
        Country: node.data.country || "N/A",
        Color: node.data.colorName || "N/A",
        Generation:
          node.data.generation !== undefined ? node.data.generation : "N/A",
        Achievements: node.data.achievements || "N/A",
        Description: node.data.description || "N/A",
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
        { wch: 40 }, // Description
      ];
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Pigeon Pedigree");

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `pigeon-pedigree-${currentDate}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      console.log("Excel export completed successfully");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error exporting to Excel. Please try again.");
    }
  }, [nodes]);

  // PDF Export Function
  // Enhanced PDF Export Function with OKLCH support
  const exportToPDF = useCallback(async () => {
    try {
      if (!chartRef.current) {
        alert("Chart not ready for export. Please try again.");
        return;
      }

      // Show loading state
      const exportButton = document.querySelector("[data-export-pdf]");
      if (exportButton) {
        exportButton.textContent = "Exporting...";
        exportButton.disabled = true;
      }

      // Convert OKLCH to RGB
      const convertOklchToRgb = (oklchString) => {
        const oklchMatch = oklchString.match(/oklch\(\s*([^)]+)\s*\)/);
        if (!oklchMatch) return oklchString;

        const values = oklchMatch[1]
          .split(/\s+/)
          .map((v) => parseFloat(v.replace("%", "")));
        const [l, c, h] = values;

        // OKLCH to RGB conversion (simplified)
        const hRad = ((h || 0) * Math.PI) / 180;
        const a = c * Math.cos(hRad);
        const b = c * Math.sin(hRad);

        // Convert to RGB
        const y = (l + 16) / 116;
        const x = a / 500 + y;
        const z = y - b / 200;

        const r = Math.max(
          0,
          Math.min(
            255,
            Math.round(255 * (3.2406 * x - 1.5372 * y - 0.4986 * z))
          )
        );
        const g = Math.max(
          0,
          Math.min(
            255,
            Math.round(255 * (-0.9689 * x + 1.8758 * y + 0.0415 * z))
          )
        );
        const blue = Math.max(
          0,
          Math.min(255, Math.round(255 * (0.0557 * x - 0.204 * y + 1.057 * z)))
        );

        return `rgb(${r}, ${g}, ${blue})`;
      };

      // Convert LAB to RGB
      const convertLabToRgb = (labString) => {
        const labMatch = labString.match(/lab\(\s*([^)]+)\s*\)/);
        if (!labMatch) return labString;

        const values = labMatch[1]
          .split(/\s+/)
          .map((v) => parseFloat(v.replace("%", "")));
        const [l, a, b] = values;

        const y = (l + 16) / 116;
        const x = a / 500 + y;
        const z = y - b / 200;

        const r = Math.max(
          0,
          Math.min(
            255,
            Math.round(255 * (3.2406 * x - 1.5372 * y - 0.4986 * z))
          )
        );
        const g = Math.max(
          0,
          Math.min(
            255,
            Math.round(255 * (-0.9689 * x + 1.8758 * y + 0.0415 * z))
          )
        );
        const blue = Math.max(
          0,
          Math.min(255, Math.round(255 * (0.0557 * x - 0.204 * y + 1.057 * z)))
        );

        return `rgb(${r}, ${g}, ${blue})`;
      };

      // Convert LCH to RGB
      const convertLchToRgb = (lchString) => {
        const lchMatch = lchString.match(/lch\(\s*([^)]+)\s*\)/);
        if (!lchMatch) return lchString;

        const values = lchMatch[1]
          .split(/\s+/)
          .map((v) => parseFloat(v.replace("%", "")));
        const [l, c, h] = values;

        // LCH to LAB
        const hRad = ((h || 0) * Math.PI) / 180;
        const a = c * Math.cos(hRad);
        const b = c * Math.sin(hRad);

        // LAB to RGB
        const y = (l + 16) / 116;
        const x = a / 500 + y;
        const z = y - b / 200;

        const r = Math.max(
          0,
          Math.min(
            255,
            Math.round(255 * (3.2406 * x - 1.5372 * y - 0.4986 * z))
          )
        );
        const g = Math.max(
          0,
          Math.min(
            255,
            Math.round(255 * (-0.9689 * x + 1.8758 * y + 0.0415 * z))
          )
        );
        const blue = Math.max(
          0,
          Math.min(255, Math.round(255 * (0.0557 * x - 0.204 * y + 1.057 * z)))
        );

        return `rgb(${r}, ${g}, ${blue})`;
      };

      // Universal color converter
      const convertColorToRgb = (colorString) => {
        if (colorString.includes("oklch("))
          return convertOklchToRgb(colorString);
        if (colorString.includes("lab(")) return convertLabToRgb(colorString);
        if (colorString.includes("lch(")) return convertLchToRgb(colorString);
        return colorString;
      };

      // Replace all modern color formats with RGB
      const temporarilyReplaceModernColors = (element) => {
        const originalStyles = [];

        const processElement = (el) => {
          if (el.nodeType === Node.ELEMENT_NODE) {
            const style = el.getAttribute("style");
            const computedStyle = window.getComputedStyle(el);

            let needsReplacement = false;
            let newStyle = style || "";

            // Check inline style attribute for modern color formats
            if (
              style &&
              (style.includes("oklch(") ||
                style.includes("lab(") ||
                style.includes("lch("))
            ) {
              needsReplacement = true;
              newStyle = style.replace(/(oklch|lab|lch)\([^)]+\)/g, (match) => {
                return convertColorToRgb(match);
              });
            }

            // Check computed styles for modern color formats
            const colorProperties = [
              "color",
              "background-color",
              "border-color",
              "border-top-color",
              "border-right-color",
              "border-bottom-color",
              "border-left-color",
              "fill",
              "stroke",
              "outline-color",
              "text-decoration-color",
            ];

            colorProperties.forEach((prop) => {
              const value = computedStyle.getPropertyValue(prop);
              if (
                value &&
                (value.includes("oklch(") ||
                  value.includes("lab(") ||
                  value.includes("lch("))
              ) {
                needsReplacement = true;
                const convertedColor = convertColorToRgb(value);
                newStyle += `; ${prop}: ${convertedColor} !important`;
              }
            });

            if (needsReplacement) {
              originalStyles.push({
                element: el,
                originalStyle: style,
                hasStyle: el.hasAttribute("style"),
              });
              el.setAttribute("style", newStyle);
            }

            // Process child elements
            Array.from(el.children).forEach(processElement);
          }
        };

        processElement(element);
        return originalStyles;
      };

      // Apply color replacements
      const styleBackups = temporarilyReplaceModernColors(chartRef.current);
      const truncationBackups = [];
      const removeTruncation = (el) => {
        if (!el) return;
        const elements = el.querySelectorAll(
          ".truncate, .overflow-hidden, .whitespace-nowrap"
        );
        elements.forEach((e) => {
          const original = {
            element: e,
            classList: Array.from(e.classList),
            style: e.getAttribute("style"),
          };
          truncationBackups.push(original);
          // remove classes that cause clipping
          e.classList.remove(
            "truncate",
            "overflow-hidden",
            "whitespace-nowrap"
          );
          // also remove inline overflow styles that could clip text
          const oldStyle = e.getAttribute("style") || "";
          const newStyle = oldStyle
            .replace(/overflow:\s*hidden;?/g, "")
            .replace(/text-overflow:\s*ellipsis;?/g, "")
            .replace(/white-space:\s*nowrap;?/g, "");
          if (newStyle.trim()) e.setAttribute("style", newStyle);
          else e.removeAttribute("style");
        });
      };
      removeTruncation(chartRef.current);
      // Wait for DOM updates
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Configure html2canvas
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: chartRef.current.scrollWidth,
        height: chartRef.current.scrollHeight,
        logging: false,
        ignoreElements: (element) => {
          return (
            element.classList &&
            element.classList.contains("html2canvas-ignore")
          );
        },
      });

      // Restore original styles
      styleBackups.forEach((backup) => {
        if (backup.hasStyle && backup.originalStyle) {
          backup.element.setAttribute("style", backup.originalStyle);
        } else if (!backup.hasStyle) {
          backup.element.removeAttribute("style");
        }
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      // Calculate PDF dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const maxWidth = imgWidth > imgHeight ? 1120 : 790;
      const maxHeight = imgWidth > imgHeight ? 790 : 1120;
      const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
      const finalWidth = imgWidth * scale;
      const finalHeight = imgHeight * scale;

      // Create PDF
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "px",
        format: [finalWidth + 40, finalHeight + 40],
      });

      const xOffset = 20;
      const yOffset = 20;

      pdf.addImage(imgData, "PNG", xOffset, yOffset, finalWidth, finalHeight);

      // Save PDF
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `pigeon-pedigree-chart-${currentDate}.pdf`;
      pdf.save(filename);

      console.log("PDF export completed successfully");
    } catch (error) {
      console.error("Error exporting to PDF:", error);

      // More specific error messages
      if (
        error.message &&
        (error.message.includes("oklch") ||
          error.message.includes("lab") ||
          error.message.includes("lch"))
      ) {
        alert(
          "Error: Unsupported color format detected. Please try refreshing the page and exporting again."
        );
      } else if (error.message && error.message.includes("canvas")) {
        alert(
          "Error: Unable to capture chart image. Please ensure the chart is fully loaded and try again."
        );
      } else {
        alert("Error exporting to PDF. Please try again or refresh the page.");
      }
    } finally {
      // Reset button state
      const exportButton = document.querySelector("[data-export-pdf]");
      if (exportButton) {
        exportButton.textContent = "Export as PDF";
        exportButton.disabled = false;
      }
    }
  }, []);

  const defaultViewport = { x: 0, y: 0, zoom: 0.8 };

  if (isLoading) return <Spinner />;

  return (
    <div className="container  mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mt-12 px-4 md:px-8 lg:px-12">
        <div className="max-w-2xl mb-6">
          <h2 className="text-black font-bold text-2xl lg:text-4xl mb-4">
            Pigeon pedigree
          </h2>
          {/* <p className="text-destructive">
            The Pedigree Chart displays your pigeon's lineage across multiple
            generations, showing key details like name, ring number, and
            birthdate. It helps you track breeding relationships and plan future
            pairings.
          </p> */}
        </div>
        <div className="flex gap-5">
          <Button
            onClick={exportToExcel}
            className="bg-primary py-6 text-white hover:text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export as Excel
          </Button>
          <Button
            onClick={exportToPDF}
            data-export-pdf
            className="bg-primary py-6 text-white hover:text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export as PDF
          </Button>
        </div>
      </div>
      <div
        ref={chartRef}
        className="w-full h-[2000px] bg-transparent flex justify-start items-center mt-0 rounded-3xl"
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
          proOptions={{ hideAttribution: true }}
        >
          {/* <Background variant="dots" gap={25} size={1.5} color="#FFFFFF" /> */}
        </ReactFlow>
      </div>
    </div>
  );
}
