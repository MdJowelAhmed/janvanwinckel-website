"use client";
import Spinner from "@/app/(commonLayout)/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMyProfileQuery } from "@/redux/featured/auth/authApi";

const PrivateRoute = ({ children, loggedInDynamicRoutes = [] }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: userData, isLoading: userLoading, error } = useMyProfileQuery(undefined, {
    skip: !shouldFetch,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // User not logged in → redirect to login
      localStorage.setItem("redirectPath", window.location.pathname);
      router.push("/login");
      return;
    }

    // Token found → fetch user data
    setShouldFetch(true);
  }, [router]);

  useEffect(() => {
    if (!shouldFetch || userLoading) return;

    if (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    if (userData) {
      const userRole = userData?.role;
      const currentPath = window.location.pathname;

      // ✅ If user is logged in but not PAIDUSER
      if (userRole !== "PAIDUSER") {
        // Allow some pages even if not paid
        const canAccess = loggedInDynamicRoutes.some((route) =>
          currentPath.startsWith(route)
        );

        if (canAccess) {
          setLoading(false);
          return;
        }

        // Otherwise redirect to subscription
        router.push("/subscription");
        return;
      }

      // ✅ If user is PAIDUSER → allow access
      setLoading(false);
    }
  }, [shouldFetch, userData, userLoading, error, router, loggedInDynamicRoutes]);

  if (loading || userLoading) {
    return <Spinner />;
  }

  return children;
};

export default PrivateRoute;
