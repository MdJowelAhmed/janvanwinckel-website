"use client";

import React from "react";
import { CheckCircle, ArrowLeft, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMyProfileQuery } from "@/redux/featured/auth/authApi";

const PaymentSuccessPage = () => {
  const { data: userData } = useMyProfileQuery();
  console.log("userData from success", userData);
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className=" text-gray-900 mb-2">
            {userData?.subscription?.package
              ? `You have successfully subscribed to the ${userData.subscription.package} package.`
              : "Thank you for subscribing your free trial, enjoy exploring all of our features"}
          </h1>

          {/* <p className="text-gray-600">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </p> */}
        </div>

        {/* Payment Details */}
        {/* <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Transaction ID:</span>
            <span className="text-sm font-mono text-gray-900">#TXN-123456789</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-sm font-semibold text-gray-900">$99.00</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Payment Method:</span>
            <span className="text-sm text-gray-900">•••• •••• •••• 4242</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Date:</span>
            <span className="text-sm text-gray-900">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div> */}

        {/* Action Buttons */}
        {/* <div className="space-y-3 mb-6">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
          
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            Email Receipt
          </button>
        </div> */}

        {/* Confirmation Message */}
        {/* <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            A confirmation email has been sent to your registered email address.
          </p>
        </div> */}

        {/* Navigation */}
        <div className="flex gap-3  items-center justify-center">
          <Link href="/loft-overview">
            <Button className="flex-1 bg-accent text-white hover:bg-accent/90 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              {/* <ArrowLeft className="w-4 h-4" /> */}
              Go to Loft Overview
            </Button>
          </Link>

          {/* <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
            Continue Shopping
          </button> */}
        </div>

        {/* Support */}
        {/* <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact our{' '}
            <button className="text-blue-600 hover:text-blue-700 underline">
              support team
            </button>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
