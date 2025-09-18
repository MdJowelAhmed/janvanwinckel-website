import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link"; // Import Link for navigation

export default function AllClasses({ onBack, onClassClick }) {
  const [activeCategory, setActiveCategory] = useState("all");

  // All yoga classes data
  const allClasses = [
    {
      id: 1,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (7).png",
      category: "cooling",
    },
    {
      id: 2,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (11).png",
      category: "cooling",
    },
    {
      id: 3,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (12).png",
      category: "cooling",
    },
    {
      id: 4,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (13).png",
      category: "cooling",
    },
    {
      id: 5,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (15).png",
      category: "cooling",
    },
    {
      id: 6,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (16).png",
      category: "cooling",
    },
    {
      id: 7,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (17).png",
      category: "cooling",
    },
    {
      id: 8,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (9).png",
      category: "cooling",
    },
    {
      id: 9,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (10).png",
      category: "cooling",
    },
    {
      id: 10,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (7).png",
      category: "cooling",
    },
    {
      id: 11,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (12).png",
      category: "cooling",
    },
    {
      id: 12,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (17).png",
      category: "cooling",
    },
  ];

  return (
    <section className="mb-10 mx-3">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-2"
        onClick={onBack}
      >
        <ArrowLeft size={16} /> Back
      </Button>

      <h1 className="text-2xl font-bold mb-6">All Categories</h1>

      {/* Grid of class cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-10">
        {allClasses.map((yogaClass) => (
          <div
            key={yogaClass.id}
            className="relative h-80 rounded-lg overflow-hidden cursor-pointer group"
          >
            {/* Link to navigate to the favorite page with dynamic id */}
            <Link href={`/favorite/${yogaClass.id}`}>
              <div className="relative w-full h-full">
                {/* Image displayed on top */}
                <Image
                  src={yogaClass.image}
                  alt={yogaClass.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 w-full h-full"
                />
                {/* Gradient Overlay on top of the image */}
                <div
                  className="absolute inset-0 bg-gradient-to-t"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, #FFFFFF00, #FFFFFF00, #A92C2C)",
                  }}
                />
                <div className="absolute inset-0 flex items-end p-4">
                  <h3 className="text-white font-medium text-lg">
                    {yogaClass.title}
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
