"use client";
import Spinner from "@/app/(commonLayout)/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMyProfileQuery } from "@/redux/featured/auth/authApi";

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { data: userData, isLoading: userLoading, error } = useMyProfileQuery();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      localStorage.setItem("redirectPath", window.location.pathname);
      router.push("/login");
      return;
    }
    
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
        router.push("/subscription");
      } else if (userRole === "PAIDUSER") {
        // Paid user - allow access
        setLoading(false);
      } else {
        // Unknown role - redirect to login
        router.push("/login");
      }
    }
  }, [router, userData, userLoading, error]);
  
  if (loading || userLoading) {
    return <Spinner />;
  }
  
  return children;
};

export default PrivateRoute;