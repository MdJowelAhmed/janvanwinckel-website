import React from "react";
import jsPDF from "jspdf";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { baseUrlApi } from "@/redux/baseUrl/baseUrlApi";

const PigeonPdfExport = ({ pigeon, siblings = [] }) => {
  // Function to convert image to base64 with CORS handling
  const getBase64FromUrl = async (url) => {
    try {
      // Clean URL and handle both absolute and relative paths
      let imageUrl;
      if (url.includes('http')) {
        imageUrl = url;
      } else {
        // Remove leading slash from url if baseUrlApi already ends with slash
        const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
        const cleanBase = baseUrlApi.endsWith('/') ? baseUrlApi.slice(0, -1) : baseUrlApi;
        imageUrl = `${cleanBase}/${cleanUrl}`;
      }
      
      const response = await fetch(imageUrl, {
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error loading image:", error);
      return null;
    }
  };

  const handleExportPDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      // Helper function to add text with auto page break
      const addText = (text, fontSize = 10, isBold = false) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", isBold ? "bold" : "normal");
        pdf.text(text, margin, yPosition);
        yPosition += fontSize * 0.5 + 2;
      };

      // Helper function to add section header with custom color
      const addSectionHeader = (title) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        yPosition += 5;
        pdf.setFillColor(55, 183, 195);
        pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(title, margin + 2, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 10;
      };

      // Title
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Pigeon Overview Report", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 10;

      // Date
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Generated on: ${moment().format("DD MMM YYYY, hh:mm A")}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += 12;

      // Add Pigeon Image if available - Fixed logic
      const imageSource = pigeon?.pigeonPhoto || pigeon?.eyePhoto || pigeon?.pedigreePhoto;
      if (imageSource) {
        try {
          const base64Image = await getBase64FromUrl(imageSource);
          if (base64Image) {
            const imgWidth = 50;
            const imgHeight = 50;
            const imgX = (pageWidth - imgWidth) / 2;
            
            // Check if we need a new page for image
            if (yPosition + imgHeight > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            
            pdf.addImage(base64Image, "JPEG", imgX, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 10;
          }
        } catch (error) {
          console.error("Error adding image:", error);
        }
      }

      // Basic Information Section
      addSectionHeader("Basic Information");
      addText(`Name: ${pigeon?.name || "N/A"}`, 10, true);
      addText(`Ring Number: ${pigeon?.ringNumber || "N/A"}`);
      addText(`Birth Year: ${pigeon?.birthYear || "N/A"}`);
      addText(`Gender: ${pigeon?.gender || "N/A"}`);
      addText(`Color: ${pigeon?.color || "N/A"}`);
      addText(`Country: ${pigeon?.country || "N/A"}`);
      addText(`Status: ${pigeon?.status || "Racing"}`);

      // Parents Information
      addSectionHeader("Parents Information");
      addText(
        `Father: ${pigeon?.fatherRingId?.name || "N/A"} (${
          pigeon?.fatherRingId?.ringNumber || "N/A"
        })`
      );
      addText(
        `Mother: ${pigeon?.motherRingId?.name || "N/A"} (${
          pigeon?.motherRingId?.ringNumber || "N/A"
        })`
      );

      // Additional Information
      addSectionHeader("Additional Information");
      addText(`Breeder: ${pigeon?.breeder?.breederName || "N/A"}`);
      addText(`Breeder Loft Name: ${pigeon?.breeder?.loftName || "N/A"}`);
      addText(`Location: ${pigeon?.location || "N/A"}`);

      if (pigeon?.shortInfo) {
        yPosition += 3;
        addText("Your Story:", 10, true);
        const storyLines = pdf.splitTextToSize(
          pigeon.shortInfo,
          pageWidth - 2 * margin
        );
        storyLines.forEach((line) => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        });
      }

      // Race Results - Only add if data exists
      if (pigeon?.results && pigeon.results.length > 0) {
        addSectionHeader("Race Results");

        // Check if we need a new page for the table
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        // Table headers
        const tableTop = yPosition;
        const colWidths = {
          name: 50,
          date: 30,
          distance: 25,
          total: 25,
          place: 25,
        };
        let xPos = margin;

        // Header background with custom color
        pdf.setFillColor(55, 183, 195);
        pdf.rect(margin, tableTop - 5,  pageWidth - 2 * margin, 7, "F");
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(255, 255, 255);

        pdf.text("Name", xPos, tableTop);
        xPos += colWidths.name;
        pdf.text("Date", xPos, tableTop);
        xPos += colWidths.date;
        pdf.text("Distance", xPos, tableTop);
        xPos += colWidths.distance;
        pdf.text("Total Birds", xPos, tableTop);
        xPos += colWidths.total;
        pdf.text("Place", xPos, tableTop);

        pdf.setTextColor(0, 0, 0);
        yPosition = tableTop + 5;

        // Table rows
        pdf.setFont("helvetica", "normal");
        pigeon.results.forEach((race, index) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }

          xPos = margin;
          const rowY = yPosition;

          // Alternate row background
          if (index % 2 === 0) {
            pdf.setFillColor(245, 245, 245);
            pdf.rect(margin, rowY - 4, pageWidth - 2 * margin, 7, "F");
          }

          pdf.text(race.name || "N/A", xPos, rowY);
          xPos += colWidths.name;
          pdf.text(
            race.date ? moment(race.date).format("DD MMM YYYY") : "N/A",
            xPos,
            rowY
          );
          xPos += colWidths.date;
          pdf.text(race.distance?.toString() || "N/A", xPos, rowY);
          xPos += colWidths.distance;
          pdf.text(race.total?.toString() || "N/A", xPos, rowY);
          xPos += colWidths.total;
          pdf.text(race.place?.toString() || "N/A", xPos, rowY);

          yPosition += 7;
        });

        if (pigeon.raceNotes) {
          yPosition += 5;
          addText("Additional Notes:", 10, true);
          const notesLines = pdf.splitTextToSize(
            pigeon.raceNotes,
            pageWidth - 2 * margin
          );
          notesLines.forEach((line) => {
            if (yPosition > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "normal");
            pdf.text(line, margin, yPosition);
            yPosition += 5;
          });
        }
      }

      // Siblings Information - Only add if data exists
      if (siblings && siblings.length > 0) {
        // Check if we need a new page for siblings section
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin;
        }
        
        addSectionHeader("Siblings Information");

        // Check if we need space for the table
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        // Table headers for siblings
        const tableTop = yPosition;
        const sibColWidths = {
          name: 35,
          type: 25,
          ring: 30,
          year: 20,
          breeder: 20,
          racer: 20,
          gender: 20,
        };
        let xPos = margin;

        // Header background
        pdf.setFillColor(55, 183, 195);
        pdf.rect(margin, tableTop - 5, pageWidth - 2 * margin, 7, "F");
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(255, 255, 255);

        pdf.text("Name", xPos, tableTop);
        xPos += sibColWidths.name;
        pdf.text("Type", xPos, tableTop);
        xPos += sibColWidths.type;
        pdf.text("Ring Number", xPos, tableTop);
        xPos += sibColWidths.ring;
        pdf.text("Birth Year", xPos, tableTop);
        xPos += sibColWidths.year;
        pdf.text("Breeder", xPos, tableTop);
        xPos += sibColWidths.breeder;
        pdf.text("Racer", xPos, tableTop);
        xPos += sibColWidths.racer;
        pdf.text("Gender", xPos, tableTop);

        pdf.setTextColor(0, 0, 0);
        yPosition = tableTop + 5;

        // Table rows for siblings
        pdf.setFont("helvetica", "normal");
        siblings.forEach((sibling, index) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }

          xPos = margin;
          const rowY = yPosition;

          // Alternate row background
          if (index % 2 === 0) {
            pdf.setFillColor(245, 245, 245);
            pdf.rect(margin, rowY - 4, pageWidth - 2 * margin, 7, "F");
          }

          pdf.setFontSize(8);
          pdf.text(
            pdf.splitTextToSize(sibling.name || "N/A", sibColWidths.name - 2)[0],
            xPos,
            rowY
          );
          xPos += sibColWidths.name;
          pdf.text(sibling.type || "N/A", xPos, rowY);
          xPos += sibColWidths.type;
          pdf.text(sibling.ringNumber || "N/A", xPos, rowY);
          xPos += sibColWidths.ring;
          pdf.text(sibling.birthYear?.toString() || "N/A", xPos, rowY);
          xPos += sibColWidths.year;
          pdf.text(sibling.breederRating?.toString() || "N/A", xPos, rowY);
          xPos += sibColWidths.breeder;
          pdf.text(sibling.racerRating?.toString() || "N/A", xPos, rowY);
          xPos += sibColWidths.racer;
          pdf.text(sibling.gender || "N/A", xPos, rowY);

          yPosition += 7;
        });
      }

      // Save PDF
      const fileName = `Pigeon_${pigeon?.ringNumber || "Report"}_${moment().format(
        "YYYYMMDD"
      )}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <Button
      onClick={handleExportPDF}
      className="text-white px-6 h-12 rounded-md flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Export PDF
    </Button>
  );
};

export default PigeonPdfExport;