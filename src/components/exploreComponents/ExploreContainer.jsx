// app/page.js
"use client";
import { useState } from "react";
import NewClasses from "./NewClasses";
import BrowseByCategory from "./BrowseByCategory";
import AllClasses from "./ClassesAllData";
import ClassDetails from "./ClassesDetails";

export default function ExploreContainer() {
  // State to track which view to show
  const [currentView, setCurrentView] = useState("home");
  const [selectedClassId, setSelectedClassId] = useState(null);

  // Function to handle navigation
  const handleNavigation = (view, id = null) => {
    setCurrentView(view);
    if (id) setSelectedClassId(id);
  };

  // Render the appropriate component based on current view
  return (
    <main className="">
      {currentView === "home" && (
        <>
          <NewClasses
            onSeeMore={() => handleNavigation("all")}
            onClassClick={(id) => handleNavigation("details", id)}
          />
          <BrowseByCategory
            onSeeMore={() => handleNavigation("all")}
            onClassClick={(id) => handleNavigation("details", id)}
          />
        </>
      )}

      {currentView === "all" && (
        <AllClasses
          onBack={() => handleNavigation("home")}
          onClassClick={(id) => handleNavigation("details", id)}
        />
      )}

      {currentView === "details" && (
        <ClassDetails
          classId={selectedClassId}
          onBack={() => handleNavigation("all")}
        />
      )}
    </main>
  );
}
