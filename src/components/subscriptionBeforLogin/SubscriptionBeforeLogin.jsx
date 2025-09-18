"use client"
import React from 'react';
import { Check, X } from 'lucide-react';
import { useGetWebPackagesQuery } from '@/redux/featured/Package/packageApi';

const SubscriptionBeforeLogin = () => {

  const {data, isLoading} = useGetWebPackagesQuery();
  const packages = data?.data;
  
  // Get the first package from API (assuming it's the premium/professional plan)
  const dynamicPackage = packages?.[0];

  // Static features for free plan
  const freeFeatures = [
    { text: "100+ of PNG & SVG Uploaded Pictures", included: true },
    { text: "Access to 4 Generation Details", included: true },
    { text: "Upload custom icons and fonts", included: false },
    { text: "Unlimited Sharing", included: false },
    { text: "Upload graphics & video in up to 4K", included: false },
    { text: "Unlimited Projects", included: false },
    { text: "Instant Access to our design system", included: false },
    { text: "Create teams to collaborate on designs", included: false }
  ];

  const handlePurchaseClick = () => {
    if (dynamicPackage?.paymentLink) {
      window.open(dynamicPackage.paymentLink, '_blank');
    }
  };

  return (
    <div className="my-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            View Subscription{' '}
            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Prices
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Experience year-round comfort with our A-rated uPVC windows, designed to keep your 
            home warm in winter, cool in summer, and stylish every day.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Static Free Plan */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Freebie</h3>
              <p className="text-gray-600 mb-6">
                Ideal for individuals who need quick access to basic features.
              </p>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-teal-500">$0</span>
                <span className="text-gray-500 ml-2">/ Free</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`rounded-full p-1 mt-0.5 ${
                    feature.included 
                      ? 'bg-teal-100 text-teal-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {feature.included ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    feature.included ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Disabled Purchase Button */}
            <button 
              disabled 
              className="w-full bg-gray-300 text-gray-500 py-4 px-6 rounded-xl font-semibold cursor-not-allowed shadow-md"
            >
              Purchase Now
            </button>
          </div>

          {/* Dynamic Plan from API */}
          {isLoading ? (
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading...</p>
              </div>
            </div>
          ) : dynamicPackage ? (
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
              
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-bold mb-2">{dynamicPackage.title}</h3>
                <p className="text-teal-100 mb-6">
                  {dynamicPackage.description}
                </p>
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-bold">${dynamicPackage.price}</span>
                  <span className="text-teal-200 ml-2">/ {dynamicPackage.paymentType}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 relative z-10">
                {dynamicPackage.features?.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-1 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-white/90">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={handlePurchaseClick}
                className="w-full bg-white text-teal-600 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300 shadow-md hover:shadow-lg relative z-10"
              >
                Purchase Now
              </button>
            </div>
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