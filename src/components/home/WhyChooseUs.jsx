import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Zap, Heart, Database } from 'lucide-react';
import Image from 'next/image';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Settings,
      title: "Real - Pedigree Calculate",
      description: "More insights available with live data & informative insights, delivered in real time to stay ahead of the curve.",
      bgColor: "bg-teal-500",
      iconBg: "bg-teal-50"
    },
    {
      icon: Zap,
      title: "First Racing Capability",
      description: "More insights available with live data & informative insights, delivered in real time to stay ahead of the curve.",
      bgColor: "bg-cyan-500",
      iconBg: "bg-cyan-50"
    },
    {
      icon: Heart,
      title: "Pedigree Guidelines",
      description: "More insights available with live data & informative insights, delivered in real time to stay ahead of the curve.",
      bgColor: "bg-slate-600",
      iconBg: "bg-slate-50"
    },
    {
      icon: Database,
      title: "All Records Reservation",
      description: "More insights available with live data & informative insights, delivered in real time to stay ahead of the curve.",
      bgColor: "bg-gray-700",
      iconBg: "bg-gray-50"
    }
  ];

  return (
    <div className="py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why <span className="text-cyan-500">Choose Us?</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Experience year-round comfort with our A-rated uPVC windows, designed to keep your home warm in winter,
            cool in summer, and stylish every day.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Features Section */}
          <div className="flex flex-col justify-between space-y-6">
            {features.map((feature, index) => (
              <div
                key={index} 
                className="border border-[#37B7C3]/20 rounded-lg transition-all duration-300 flex-1"
              >
                <CardContent className="p-6 h-full">
                  <div className="flex flex-col items-start space-x-4 h-full">
                    {/* Icon Container */}
                    <div className="rounded-lg relative mb-3 ml-3">
                      <feature.icon className="w-6 h-6" />                      
                    </div>
                                       
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-accent mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-destructive text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>
            ))}
          </div>

          {/* Image Section */}
          <div className="relative h-full min-h-[600px]">
            <Image
              src="/assests/whyChoose.webp"
              alt="Why Choose Us"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;