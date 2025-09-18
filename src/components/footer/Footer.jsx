import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <div className="flex flex-col border-t mt-12 md:mt-20">
      {/* Footer with Teal Background - Updated to match image */}
      <footer className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            {/* Left Section - Company Info */}

            <div className=" max-w-md">
              <div>
                <Image
                  src="/assests/logo.png"
                  width={100}
                  height={100}
                  alt="Logo"
                  className="mb-6"
                />
              </div>
              <p className="text-white text-sm leading-relaxed">
                Pigeon-wise Windows Limited is an Introducer Appointed
                Representative (Financial Services Register No: 800000) of
                Phoenix Financial Consultants Limited (Phoenix), Phoenix is a
                Credit Broker (not a Lender), Phoenix is authorised and
                regulated by the Financial Conduct Authority (Financial Services
                Register No: 539195), and offers finance from their panel of
                lenders. All finance subject to status and credit checks.
              </p>
            </div>

            {/* Right Section - Navigation Links */}
            <div className="flex items-center h-full justify-center lg:mt-20 flex-col lg:flex-row gap-8 lg:gap-12">
              <Link href="/" className="text-white hover:text-teal-200 text-sm">
                Home
              </Link>
              <Link
                href="/help"
                className="text-white hover:text-teal-200 text-sm"
              >
                Help
              </Link>

              <Link
                href="/terms"
                className="text-white hover:text-teal-200 text-sm"
              >
                Terms & Condition
              </Link>
              <Link
                href="/contact"
                className="text-white hover:text-teal-200 text-sm"
              >
                Contact Info
              </Link>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4 mt-8">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-teal-600 font-bold text-sm">f</span>
            </div>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-teal-600 font-bold text-sm">in</span>
            </div>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-teal-600 font-bold text-sm">X</span>
            </div>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-teal-600 font-bold text-sm">P</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
