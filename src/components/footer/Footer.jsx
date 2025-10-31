import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";

export default function Footer() {
  return (
    <div className="flex flex-col border-t  ">
      {/*  */}
      <footer className="bg-primary py- px-4 md:px-8 lg:px-12">
        {/* <div className="text-center  max-w-lg mx-auto font-semibold text-3xl text-white mb-6">
          <h2>Learn how to grow 💪audience fast in Pigeon Hub</h2>
        </div>
        <Separator /> */}
        <div className="container mx-auto px-4 pb-2">
          <div className="flex  flex-row justify-between items-center gap-8 my-4">
            {/* Left Section - Company Info */}

            <div className=" max-w-md">
              <div>
                <Image
                  src="/assests/logo.png"
                  width={60}
                  height={60}
                  alt="Logo"
                  className=""
                />
              </div>
              {/* <p className="text-white text-sm leading-relaxed">
                Pigeon-wise Windows Limited is an Introducer Appointed
                Representative (Financial Services Register No: 800000) of
                Phoenix Financial Consultants Limited (Phoenix), Phoenix is a
                Credit Broker (not a Lender), Phoenix is authorised and
                regulated by the Financial Conduct Authority (Financial Services
                Register No: 539195), and offers finance from their panel of
                lenders. All finance subject to status and credit checks.
              </p> */}
            </div>

            {/* Right Section - Navigation Links */}
            <div className="flex items-center h-full justify-center    lg:flex-row gap-8 lg:gap-12">
              {/* <Link href="/" className="text-white hover:text-teal-200 text-sm">
                Home
              </Link> */}
              {/* <Link
                href="/help"
                className="text-white hover:text-teal-200 text-sm"
              >
                Help
              </Link> */}

              <Link
                href="/terms"
                className="text-white hover:text-teal-200 text-sm"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/about-us"
                className="text-white hover:text-teal-200 text-sm"
              >
               About us
              </Link>
              <Link
                href="/contact"
                className="text-white hover:text-teal-200 text-sm"
              >
                Contact us
              </Link>
            </div>
          </div>

          {/* Social Media Icons */}
          {/* <div className="flex gap-8 items-center  mt-8">
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
          </div> */}
        </div>
      </footer>
    </div>
  );
}
