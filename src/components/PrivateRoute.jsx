"use client";
import Spinner from "@/app/(commonLayout)/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMyProfileQuery } from "@/redux/featured/auth/authApi";
import { toast } from "sonner";

const PrivateRoute = ({ children, loggedInDynamicRoutes = [] }) => {
  const router = useRouter();
  const [shouldFetch, setShouldFetch] = useState(false);
  const [toastShown, setToastShown] = useState(false); // Track toast state

  const { data: userData, isLoading: userLoading, error } = useMyProfileQuery(undefined, {
    skip: !shouldFetch,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      if (!toastShown) {
        localStorage.setItem("redirectPath", window.location.pathname);
        toast.info("Please login first to access this page.", {
          position: "top-center",
          duration: 2000,
        });
        setToastShown(true); // Set toast as shown
      }

      setTimeout(() => {
        router.push("/login");
      }, 2000);

      return; // stop here
    }

    setShouldFetch(true);
  }, [router, toastShown]);

  useEffect(() => {
    if (!shouldFetch || userLoading) return;

    if (error) {
      if (!toastShown) {
        console.error("Error fetching user data:", error);
        toast.error("Your session has expired. Please login again.");
        setToastShown(true); // Set toast as shown
      }

      localStorage.removeItem("token");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    if (userData) {
      const userRole = userData?.role;
      const currentPath = window.location.pathname;

      if (userRole !== "PAIDUSER") {
        const canAccess = loggedInDynamicRoutes.some((route) =>
          currentPath.startsWith(route)
        );

        if (!canAccess) {
          if (!toastShown) {
            toast.warning("Please subscribe first to access this page.", {
              position: "top-center",
              duration: 2000,
            });
            setToastShown(true); // Set toast as shown
          }

          // ✅ Redirect to subscription page
          setTimeout(() => {
            router.push("/subscription");
          }, 2000);

          return; // stop rendering protected page
        }
      }
    }
  }, [shouldFetch, userData, userLoading, error, router, loggedInDynamicRoutes, toastShown]);

  if (userLoading) {
    return <Spinner />;
  }

  return children;
};

export default PrivateRoute;
