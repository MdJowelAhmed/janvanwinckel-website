"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { useCreateNewsletterMutation } from "@/redux/featured/newsletter/newsletterApi";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [createNewsletter, { isLoading: isCreating }] =
    useCreateNewsletterMutation();

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      // API call
      const res = await createNewsletter({ email }).unwrap();
      console.log(res)

      toast.success("You've successfully subscribed to our newsletter!");
      setEmail("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="my-10 lg:my-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-lg mx-auto text-center mb-6">
        <h2 className="text-3xl font-bold">Our Newsletter</h2>
        <p>Subscribe to our newsletter to get the latest updates and news from us.</p>
      </div>
      <div
        className="h-[600px] bg-cover bg-center bg-no-repeat relative flex items-center overflow-hidden rounded-[30px]"
        style={{
          backgroundImage: `url('/assests/newsletter.webp')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-[30px]"></div>

        <div className="relative z-10 w-full mx-auto px-8 md:px-12 lg:px-16 xl:px-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Text */}
            <div className="text-white max-w-lg">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Newsletter</h1>
              <p>
                Stay updated with our latest news, insights, and exclusive
                content delivered straight to your inbox. Join thousands of readers
                who trust our insights. No spam, unsubscribe anytime.
              </p>
            </div>

            {/* Right side - Input and Button */}
            <div>
              <div className="space-y-4 max-w-lg">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 pr-4 text-lg bg-white/90 border-white/30 text-gray-900 placeholder:text-gray-600 focus:bg-white focus:border-blue-500"
                    disabled={isCreating}
                  />
                  <Mail
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={20}
                  />
                </div>

                <Button
                  onClick={handleSubscribe}
                  disabled={isCreating || !email}
                  className="w-full h-14 text-lg font-semibold bg-accent text-white"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Subscribing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send size={20} />
                      Subscribe Now
                    </div>
                  )}
                </Button>
              </div>

              <p className="text-xs text-white/80 mt-4 text-center">
                By subscribing, you agree to our privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
