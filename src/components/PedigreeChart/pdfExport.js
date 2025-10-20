import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Enhanced PDF Export Function with improved image quality
export const captureChartAndSave = async (chartRef, filenameOverride) => {
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

    const temporarilyReplaceLabColors = (element) => {
      const originalStyles = [];

      const processElement = (el) => {
        if (el.nodeType === Node.ELEMENT_NODE) {
          const style = el.getAttribute("style");
          const computedStyle = window.getComputedStyle(el);

          let needsReplacement = false;
          let newStyle = style || "";

          if (style && style.includes("lab(")) {
            needsReplacement = true;
            newStyle = style.replace(/lab\([^)]+\)/g, (match) => {
              return convertLabToRgb(match);
            });
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
            if (value && value.includes("lab(")) {
              needsReplacement = true;
              const convertedColor = convertLabToRgb(value);
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

    // IMPROVED IMAGE QUALITY: Increase scale for better resolution
    const canvas = await html2canvas(chartRef.current, {
      scale: 3, // Increased from 2 to 3 for better quality
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

    // IMPROVED IMAGE QUALITY: Use higher quality settings for image data
    const imgData = canvas.toDataURL("image/png", 1.0);

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // IMPROVED IMAGE QUALITY: Increase PDF dimensions
    const maxWidth = imgWidth > imgHeight ? 1500 : 1050;
    const maxHeight = imgWidth > imgHeight ? 1050 : 1500;

    const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
    const finalWidth = imgWidth * scale;
    const finalHeight = imgHeight * scale;

    // IMPROVED IMAGE QUALITY: Use higher DPI for PDF
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? "landscape" : "portrait",
      unit: "px",
      format: [finalWidth + 40, finalHeight + 40],
      compress: false, // Disable compression for better image quality
    });

    const xOffset = 20;
    const yOffset = 20;

    // IMPROVED IMAGE QUALITY: Add image with better quality settings
    pdf.addImage(
      imgData, 
      "PNG", 
      xOffset, 
      yOffset, 
      finalWidth, 
      finalHeight, 
      undefined, 
      'FAST', // Use FAST algorithm for better quality
      0 // No rotation
    );

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
};

export const exportToPDF = async (chartRef) => {
  try {
    await captureChartAndSave(chartRef);
    console.log("PDF export completed successfully");
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    alert("Error exporting to PDF. Please try again.");
  }
};