"use client";
import HomePageContainer from "@/components/home/HomePageContainer";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { decodeToken } from "react-jwt";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      const role = decoded?.role;

      if (role === "PAIDUSER" || role === "SUPER_ADMIN") {
        router.replace("/loft-overview");
      } else if (role === "USER") {
        router.replace("/subscription");
      } else {
        router.replace("/");
      }
    }
  }, [router]);

  return (
    <div>
      <HomePageContainer />
    </div>
  );
};

export default Page;
