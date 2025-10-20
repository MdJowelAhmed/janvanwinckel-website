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
import {
  User,
  Calendar,
  Crown,
  Award,
  Info,
  Download,
  DownloadCloud,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
      <div className="flex items-center justify-between">
        {/* Left Side - Country, Birth Year, Ring Number */}
        <div
          className="flex items-center justify-center gap-1"
          style={{ alignItems: "center" }}
        >
          {countryCode && (
            <div
              className="flex items-center gap-1"
              style={{ alignItems: "center", height: "24px" }}
            >
              <img
                src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
                alt={data.country}
                width="24"
                height="18"
                className="w-6 h-5 rounded-sm"
                style={{
                  width: "24px",
                  height: "18px",
                  verticalAlign: "middle",
                  display: "inline-block",
                }}
                crossOrigin="anonymous"
              />
              <p
                className="text-black"
                style={{
                  lineHeight: "24px",
                  margin: 0,
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                {countryCode}
              </p>
            </div>
          )}

          {data.birthYear && (
            <span
              className="text-black"
              style={{
                lineHeight: "24px",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              {data.birthYear.toString().slice(-2)}
            </span>
          )}

          {data.ringNumber && (
            <span
              className="font-bold text-[#C33739]"
              style={{
                lineHeight: "24px",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              {data.ringNumber}
            </span>
          )}
        </div>

        {/* Right Side - Gender, Verified, Iconic */}
        <div
          className="flex items-center justify-center gap-1"
          style={{ alignItems: "center", height: "24px" }}
        >
          {data.gender && (
            <span
              className="text-black text-xl"
              style={{
                verticalAlign: "middle",
                lineHeight: "24px",
                display: "inline-block",
                height: "24px",
              }}
            >
              {getGenderIcon(data.gender)}
            </span>
          )}

          {data.verified && (
            <img
              src="/assests/Letter-P.png"
              alt="Letter P"
              width="24"
              height="24"
              className="w-6 h-6"
              style={{
                width: "24px",
                height: "24px",
                verticalAlign: "middle",
                display: "inline-block",
              }}
            />
          )}

          {data?.iconic && (
            <img
              src="/assests/Gold-cup.png"
              alt="Gold Cup"
              width="24"
              height="24"
              className="w-6 h-6"
              style={{
                width: "24px",
                height: "24px",
                verticalAlign: "middle",
                display: "inline-block",
              }}
            />
          )}
        </div>
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
              <img
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
            <img
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
  const captureChartAndSave = useCallback(async (filenameOverride) => {
    try {
      if (!chartRef.current) {
        throw new Error("Chart not ready");
      }

      // Show loading state
      const exportButton = document.querySelector("[data-export-pdf]");
      if (exportButton) {
        exportButton.textContent = "Exporting...";
        exportButton.disabled = true;
      }

      // CRITICAL FIX: Temporarily increase height to ensure all content is visible
      const originalHeight = chartRef.current.style.height;
      const originalMinHeight = chartRef.current.style.minHeight;
      const reactFlowElement = chartRef.current.querySelector(".react-flow");
      const reactFlowOriginalHeight = reactFlowElement
        ? reactFlowElement.style.height
        : null;

      // Force minimum height to ensure all edges are rendered
      chartRef.current.style.height = "2000px";
      chartRef.current.style.minHeight = "2000px";
      if (reactFlowElement) {
        reactFlowElement.style.height = "2000px";
      }

      // Wait for ReactFlow to adjust to new height
      await new Promise((resolve) => setTimeout(resolve, 300));

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

      const convertOklchToRgb = (oklchString) => {
        const oklchMatch = oklchString.match(/oklch\(\s*([^)]+)\s*\)/);
        if (!oklchMatch) return oklchString;

        const values = oklchMatch[1]
          .split(/\s+/)
          .map((v) => parseFloat(v.replace("%", "")));
        const [l, c, h] = values;

        // Convert OKLCH to OKLAB
        const hRad = (h * Math.PI) / 180;
        const a = c * Math.cos(hRad);
        const b = c * Math.sin(hRad);

        // Convert OKLAB to linear RGB
        const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
        const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
        const s_ = l - 0.0894841775 * a - 1.291485548 * b;

        const l3 = l_ * l_ * l_;
        const m3 = m_ * m_ * m_;
        const s3 = s_ * s_ * s_;

        const r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
        const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
        const blue = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

        // Convert linear RGB to sRGB
        const toSrgb = (c) => {
          const abs = Math.abs(c);
          if (abs <= 0.0031308) return c * 12.92;
          return (Math.sign(c) || 1) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
        };

        const rSrgb = Math.max(0, Math.min(255, Math.round(toSrgb(r) * 255)));
        const gSrgb = Math.max(0, Math.min(255, Math.round(toSrgb(g) * 255)));
        const bSrgb = Math.max(
          0,
          Math.min(255, Math.round(toSrgb(blue) * 255))
        );

        return `rgb(${rSrgb}, ${gSrgb}, ${bSrgb})`;
      };

      const temporarilyReplaceLabColors = (element) => {
        const originalStyles = [];

        const processElement = (el) => {
          if (el.nodeType === Node.ELEMENT_NODE) {
            const style = el.getAttribute("style");
            const computedStyle = window.getComputedStyle(el);

            let needsReplacement = false;
            let newStyle = style || "";

            if (style && (style.includes("lab(") || style.includes("oklch("))) {
              needsReplacement = true;
              newStyle = style
                .replace(/lab\([^)]+\)/g, (match) => convertLabToRgb(match))
                .replace(/oklch\([^)]+\)/g, (match) =>
                  convertOklchToRgb(match)
                );
            }

            const colorProperties = [
              "color",
              "background-color",
              "border-color",
              "fill",
              "stroke",
            ];
            colorProperties.forEach((prop) => {
              const value = computedStyle.getPropertyValue(prop);
              if (
                value &&
                (value.includes("lab(") || value.includes("oklch("))
              ) {
                needsReplacement = true;
                let convertedColor = value;
                if (value.includes("lab(")) {
                  convertedColor = convertLabToRgb(value);
                } else if (value.includes("oklch(")) {
                  convertedColor = convertOklchToRgb(value);
                }
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

            Array.from(el.children).forEach(processElement);
          }
        };

        processElement(element);
        return originalStyles;
      };

      // Apply lab color replacements
      const styleBackups = temporarilyReplaceLabColors(chartRef.current);

      // Remove truncation
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
          e.classList.remove(
            "truncate",
            "overflow-hidden",
            "whitespace-nowrap"
          );
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

      // CRITICAL FIX: Ensure SVG edges are visible and properly positioned
      const svgEdges = chartRef.current.querySelectorAll(
        ".react-flow__edges, .react-flow__edge, svg.react-flow__edges"
      );
      const svgBackups = [];

      svgEdges.forEach((svg) => {
        const original = {
          element: svg,
          style: svg.getAttribute("style"),
          visibility: svg.style.visibility,
          display: svg.style.display,
          opacity: svg.style.opacity,
          zIndex: svg.style.zIndex,
        };
        svgBackups.push(original);

        // Force visibility and proper positioning
        svg.style.visibility = "visible !important";
        svg.style.display = "block !important";
        svg.style.opacity = "1 !important";
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.pointerEvents = "none";
        svg.style.zIndex = "5";
        svg.style.overflow = "visible";

        if (svg.tagName && svg.tagName.toLowerCase() === "svg") {
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
          svg.setAttribute("viewBox", "");
          svg.removeAttribute("viewBox");
        }

        // Ensure all paths in edges have proper stroke
        const paths = svg.querySelectorAll("path");
        paths.forEach((path) => {
          const stroke = path.getAttribute("stroke");
          if (!stroke || stroke === "none" || stroke === "transparent") {
            path.setAttribute("stroke", "#37B7C3");
          }

          const strokeWidth = path.getAttribute("stroke-width");
          if (!strokeWidth || parseFloat(strokeWidth) < 1) {
            path.setAttribute("stroke-width", "3");
          }

          path.setAttribute("fill", "none");
          path.style.visibility = "visible";
          path.style.display = "block";
          path.style.opacity = "1";
          path.style.strokeWidth = "3px";
          path.style.stroke = "#37B7C3";
        });

        // Ensure all edge groups are visible
        const gElements = svg.querySelectorAll("g");
        gElements.forEach((g) => {
          g.style.visibility = "visible";
          g.style.display = "block";
          g.style.opacity = "1";
        });
      });

      // Force render all ReactFlow edge elements specifically
      const allEdgeElements = chartRef.current.querySelectorAll(
        '[class*="react-flow__edge"]'
      );
      allEdgeElements.forEach((edge) => {
        edge.style.visibility = "visible";
        edge.style.display = "block";
        edge.style.opacity = "1";
        edge.style.zIndex = "5";
      });

      // Target the specific problematic edges before capture
      const problematicEdgeIds = [
        "father_2_1-father_3_1",
        "father_3_1-father_3_1_father",
        "father_3_1-father_3_1_mother",
      ];

      problematicEdgeIds.forEach((edgeId) => {
        const edgeElement = chartRef.current.querySelector(
          `[data-id="${edgeId}"]`
        );
        if (edgeElement) {
          edgeElement.style.visibility = "visible";
          edgeElement.style.display = "block";
          edgeElement.style.opacity = "1";
          edgeElement.style.zIndex = "10";

          const paths = edgeElement.querySelectorAll("path");
          paths.forEach((path) => {
            path.setAttribute("stroke", "#37B7C3");
            path.setAttribute("stroke-width", "3");
            path.style.stroke = "#37B7C3";
            path.style.strokeWidth = "3px";
          });
        }
      });

      // Wait even longer for all elements to render properly, especially problematic edges
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: chartRef.current.scrollWidth,
        height: chartRef.current.scrollHeight,
        windowWidth: chartRef.current.scrollWidth,
        windowHeight: chartRef.current.scrollHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        // Critical settings for SVG capture
        foreignObjectRendering: false,
        removeContainer: false,
        ignoreElements: (element) => {
          // Don't ignore any elements, especially not SVG
          return (
            element.classList &&
            element.classList.contains("html2canvas-ignore")
          );
        },
        onclone: (clonedDoc) => {
          // Additional processing on cloned document
          const clonedContainer =
            clonedDoc.querySelector(
              '[data-id="' + chartRef.current.getAttribute("data-id") + '"]'
            ) || clonedDoc.body;

          // Find and fix all edge elements in cloned document
          const clonedEdges = clonedDoc.querySelectorAll(
            '.react-flow__edges, .react-flow__edge, [class*="react-flow__edge"]'
          );
          clonedEdges.forEach((svg) => {
            svg.style.visibility = "visible";
            svg.style.display = "block";
            svg.style.opacity = "1";
            svg.style.position = "absolute";
            svg.style.top = "0";
            svg.style.left = "0";
            svg.style.width = "100%";
            svg.style.height = "100%";
            svg.style.zIndex = "1";

            if (svg.tagName.toLowerCase() === "svg") {
              svg.setAttribute("width", "100%");
              svg.setAttribute("height", "100%");
            }

            const paths = svg.querySelectorAll("path");
            paths.forEach((path) => {
              path.setAttribute("stroke", "#37B7C3");
              path.setAttribute("stroke-width", "2");
              path.setAttribute("fill", "none");
              path.style.visibility = "visible";
              path.style.display = "block";
              path.style.opacity = "1";
            });

            const gElements = svg.querySelectorAll("g");
            gElements.forEach((g) => {
              g.style.visibility = "visible";
              g.style.display = "block";
              g.style.opacity = "1";
            });
          });

          // Also target edges by their IDs - specifically the problematic ones
          const specificEdgeIds = [
            "father_2_1-father_3_1", // father_3_1 connection
            "father_3_1-father_3_1_father", // father_4_1 connection
            "father_3_1-father_3_1_mother", // mother_4_2 connection
            "mother_3_1-mother_3_1_father",
            "mother_3_1-mother_3_1_mother",
          ];

          specificEdgeIds.forEach((edgeId) => {
            // Try multiple selectors to find the edge
            let edge = clonedDoc.querySelector(`[data-id="${edgeId}"]`);
            if (!edge) {
              edge = clonedDoc.querySelector(`#${edgeId}`);
            }
            if (!edge) {
              edge = clonedDoc.querySelector(
                `.react-flow__edge[id="${edgeId}"]`
              );
            }

            if (edge) {
              edge.style.visibility = "visible !important";
              edge.style.display = "block !important";
              edge.style.opacity = "1 !important";
              edge.style.zIndex = "10";

              const paths = edge.querySelectorAll("path");
              paths.forEach((path) => {
                path.setAttribute("stroke", "#37B7C3");
                path.setAttribute("stroke-width", "3");
                path.setAttribute("fill", "none");
                path.style.visibility = "visible";
                path.style.display = "block";
                path.style.opacity = "1";
              });

              const gElements = edge.querySelectorAll("g");
              gElements.forEach((g) => {
                g.style.visibility = "visible";
                g.style.display = "block";
                g.style.opacity = "1";
              });
            }
          });

          // Brute force: Find ALL edges and make them visible
          const allPaths = clonedDoc.querySelectorAll(
            'svg path[class*="react-flow__edge"]'
          );
          allPaths.forEach((path) => {
            path.setAttribute("stroke", "#37B7C3");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("fill", "none");
            path.style.visibility = "visible";
            path.style.display = "block";
            path.style.opacity = "1";
          });
        },
      });

      // Restore all styles
      styleBackups.forEach((backup) => {
        if (backup.hasStyle && backup.originalStyle) {
          backup.element.setAttribute("style", backup.originalStyle);
        } else if (!backup.hasStyle) {
          backup.element.removeAttribute("style");
        }
      });

      truncationBackups.forEach((b) => {
        b.element.className = "";
        b.classList.forEach((c) => b.element.classList.add(c));
        if (b.style) b.element.setAttribute("style", b.style);
        else b.element.removeAttribute("style");
      });

      // Restore SVG elements
      svgBackups.forEach((backup) => {
        if (backup.style) {
          backup.element.setAttribute("style", backup.style);
        }
      });

      // Restore original heights
      chartRef.current.style.height = originalHeight;
      chartRef.current.style.minHeight = originalMinHeight;
      if (reactFlowElement && reactFlowOriginalHeight) {
        reactFlowElement.style.height = reactFlowOriginalHeight;
      }

      const imgData = canvas.toDataURL("image/png", 1.0);

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const maxWidth = imgWidth > imgHeight ? 1120 : 790;
      const maxHeight = imgWidth > imgHeight ? 790 : 1120;

      const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
      const finalWidth = imgWidth * scale;
      const finalHeight = imgHeight * scale;

      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "px",
        format: [finalWidth + 40, finalHeight + 40],
      });

      const xOffset = 20;
      const yOffset = 20;

      pdf.addImage(imgData, "PNG", xOffset, yOffset, finalWidth, finalHeight);

      const currentDate = new Date().toISOString().split("T")[0];
      const filename =
        filenameOverride || `pigeon-pedigree-chart-${currentDate}.pdf`;

      pdf.save(filename);

      return filename;
    } catch (error) {
      throw error;
    } finally {
      const exportButton = document.querySelector("[data-export-pdf]");
      if (exportButton) {
        exportButton.textContent = "Export as PDF";
        exportButton.disabled = false;
      }
    }
  }, []);

  const exportToPDF = useCallback(async () => {
    try {
      await captureChartAndSave();
      console.log("PDF export completed successfully");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Error exporting to PDF. Please try again or refresh the page.");
    }
  }, [captureChartAndSave]);

  const exportToPDFWithGenerations = useCallback(
    async (genCount) => {
      const maxGen = Math.max(0, genCount - 1);
      const originalNodes = nodes;
      const originalEdges = edges;

      try {
        // Filter nodes by generation
        const filteredNodes = originalNodes.filter((n) => {
          const gen = n?.data?.generation ?? 0;
          return gen <= maxGen;
        });

        // Keep edges that connect visible nodes
        const visibleIds = new Set(filteredNodes.map((n) => n.id));
        const filteredEdges = originalEdges.filter(
          (e) => visibleIds.has(e.source) && visibleIds.has(e.target)
        );

        // Apply filtered graph
        setNodes(filteredNodes);
        setEdges(filteredEdges);

        // Wait for ReactFlow to re-render
        await new Promise((resolve) => setTimeout(resolve, 220));

        const currentDate = new Date().toISOString().split("T")[0];
        const filename = `pigeon-pedigree-chart-${genCount}gen-${currentDate}.pdf`;

        await captureChartAndSave(filename);

        console.log(`PDF export for ${genCount} generations completed`);
      } catch (error) {
        console.error("Error exporting filtered generations:", error);
        alert("Error exporting the selected generations. Please try again.");
      } finally {
        // Restore original nodes/edges regardless of success/failure
        setNodes(originalNodes);
        setEdges(originalEdges);
      }
    },
    [nodes, edges, setNodes, setEdges, captureChartAndSave]
  );

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
          {/* Excel Export Button */}
          <Button
            onClick={exportToExcel}
            className="bg-primary text-white hover:text-white flex items-center gap-2"
          >
            <DownloadCloud className="h-4 w-4" />
            Export as Excel
          </Button>

          {/* PDF Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-primary text-white hover:text-white flex items-center gap-2">
                <DownloadCloud className="h-4 w-4" />
                Export as PDF
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => exportToPDFWithGenerations(4)}
                className="cursor-pointer"
              >
                Export as PDF (4Gen)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => exportToPDFWithGenerations(5)}
                className="cursor-pointer"
              >
                Export as PDF (5Gen)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        ref={chartRef}
        className="w-full h-[1400px] 2xl:h-[2000px] bg-transparent flex justify-start items-center mt-0 rounded-3xl"
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
