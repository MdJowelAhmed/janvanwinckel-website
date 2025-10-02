"use client";
import React from "react";
import { Check, X } from "lucide-react";
import { useGetWebPackagesQuery } from "@/redux/featured/Package/packageApi";
import { useMyProfileQuery } from "@/redux/featured/auth/authApi";

const SubscriptionBeforeLogin = () => {
  const { data: userData } = useMyProfileQuery();
  // console.log(userData);
  const { data, isLoading } = useGetWebPackagesQuery();
  const packages = data?.data;
  // console.log(packages);

  // Static features for free plan
  const freeFeatures = [
    { text: "100+ of PNG & SVG Uploaded Pictures", included: true },
    { text: "Access to 4 Generation Details", included: true },
    { text: "Upload custom icons and fonts", included: false },
    { text: "Unlimited Sharing", included: false },
    { text: "Upload graphics & video in up to 4K", included: false },
    { text: "Unlimited Projects", included: false },
    { text: "Instant Access to our design system", included: false },
    { text: "Create teams to collaborate on designs", included: false },
  ];

  const handlePurchaseClick = (paymentLink) => {
    if (paymentLink) {
      window.open(paymentLink, "_blank");
    }
  };

  return (
    <div className="my-20 px-4 md:px-8 lg:px-12">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent ">
            View Subscription{" "}
            <span className="text-accent-foreground">Prices</span>
          </h1>
          <p className="text-destructive text-lg max-w-2xl mx-auto leading-relaxed">
            Experience year-round comfort with our A-rated uPVC windows,
            designed to keep your home warm in winter, cool in summer, and
            stylish every day.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8  mx-auto">
          {/* Static Free Plan */}
          <div className="bg-[#F2F2F2] rounded-sm p-8  hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-accent mb-2">Freebie</h3>
              <p className="text-foreground mb-6">
                Ideal for individuals who need quick access to basic features.
              </p>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-accent">$0</span>
                <span className="text-foreground ml-2">/ Free</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`rounded-full p-1 mt-0.5 ${
                      feature.included
                        ? "bg-accent text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {feature.included ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      feature.included ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Disabled Purchase Button */}
            <button
              disabled
              className="w-full bg-accent text-white py-3 px-6 rounded-sm font-semibold cursor-not-allowed shadow-md"
            >
              Purchase Now
            </button>
          </div>

          {/* Dynamic Packages from API */}
          {isLoading ? (
            <div className="bg-gradient-to-br from-teal-500 to-accent rounded-3xl p-8 shadow-xl text-white relative overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading...</p>
              </div>
            </div>
          ) : packages && packages.length > 0 ? (
            packages.map((packageItem, index) => (
              <div
                key={packageItem._id || index}
                className="bg-[#088395] rounded-md p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-white relative overflow-hidden"
              >
                <div className="mb-8 relative z-10">
                  <h3 className="text-2xl font-bold mb-2">
                    {packageItem.title}
                  </h3>
                  <p className="text-teal-100 mb-6">
                    {packageItem.description}
                  </p>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-bold">
                      ${packageItem.price}
                    </span>
                    <span className="text-teal-200 ml-2">
                      / {packageItem.paymentType}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 relative z-10">
                  {packageItem.features?.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-full p-1 mt-0.5">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePurchaseClick(packageItem.paymentLink)}
                  className="w-full bg-white text-teal-600 py-3 px-6 rounded-sm font-semibold hover:bg-gray-50 transition-colors duration-300 shadow-md hover:shadow-lg relative z-10"
                >
                  Purchase Now
                </button>
              </div>
            ))
          ) : (
            <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <p>No package available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBeforeLogin;