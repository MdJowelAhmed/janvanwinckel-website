"use client";
import Spinner from "@/app/(commonLayout)/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMyProfileQuery } from "@/redux/featured/auth/authApi";

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [shouldFetch, setShouldFetch] = useState(false);
  
  // Only fetch if we have a token
  const { data: userData, isLoading: userLoading, error } = useMyProfileQuery(undefined, {
    skip: !shouldFetch
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
   
    if (!token) {
      localStorage.setItem("redirectPath", window.location.pathname);
      router.push("/login");
      return;
    }

    // Token exists, now fetch user data
    setShouldFetch(true);
   
  }, [router]);

  useEffect(() => {
    if (!shouldFetch) return;

    if (userLoading) {
      return; // Keep loading
    }
   
    if (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }
   
    if (userData) {
      const userRole = userData?.role; 
     
      if (userRole === "USER") {
        // Unpaid user - redirect to subscription
        console.log("USER detected - redirecting to subscription");
        router.push("/subscription");
      } else if (userRole === "PAIDUSER") {
        // Paid user - allow access
        console.log("PAIDUSER detected - allowing access");
        setLoading(false);
      } else {
        // Unknown role - redirect to home
        console.log("Unknown role - redirecting to home");
        router.push("/subscription");
      }
    }
  }, [shouldFetch, userData, userLoading, error, router]);
 
  if (loading || userLoading) {
    return <Spinner />;
  }
 
  return children;
};

export default PrivateRoute;