"use client";
import Spinner from "@/app/(commonLayout)/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMyProfileQuery } from "@/redux/featured/auth/authApi";
import Swal from "sweetalert2";

const PrivateRoute = ({ children, loggedInDynamicRoutes = [] }) => {
  const router = useRouter();
  const [shouldFetch, setShouldFetch] = useState(false);
  const alertShownRef = useRef(false); // ✅ useRef to prevent duplicate alerts

  const { data: userData, isLoading: userLoading, error } = useMyProfileQuery(
    undefined,
    { skip: !shouldFetch }
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      if (!alertShownRef.current) {
        alertShownRef.current = true; // instantly mark as shown
        localStorage.setItem("redirectPath", window.location.pathname);

        Swal.fire({
          icon: "info",
          title: "Please login first",
          text: "You need to login to access this page.",
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#3085d6",
          timer: 2500,
        }).then(() => {
          router.push("/login");
        });
      } else {
        router.push("/login");
      }

      return;
    }

    setShouldFetch(true);
  }, [router]);

  useEffect(() => {
    if (!shouldFetch || userLoading) return;

    if (error) {
      if (!alertShownRef.current) {
        alertShownRef.current = true;
        console.error("Error fetching user data:", error);

        Swal.fire({
          icon: "error",
          title: "Session expired",
          text: "Please login again to continue.",
          // confirmButtonText: "Login",
          // confirmButtonColor: "#37B7C3",
          timer: 2500,
        }).then(() => {
          localStorage.removeItem("token");
          router.push("/login");
        });
      } else {
        localStorage.removeItem("token");
        router.push("/login");
      }
      return;
    }

    if (userData) {
      const userRole = userData?.role;
      const currentPath = window.location.pathname;

      if (userRole !== "PAIDUSER" && userRole !== "SUPER_ADMIN") {
        const canAccess = loggedInDynamicRoutes.some((route) =>
          currentPath.startsWith(route)
        );

        if (!canAccess && !alertShownRef.current) {
          alertShownRef.current = true;

          Swal.fire({
            icon: "warning",
            title: "Subscription required",
            text: "Please subscribe to access this page.",
            confirmButtonText: "Go to Subscription",
            confirmButtonColor: "#37B7C3",
            timer: 2500,
          }).then(() => {
            router.push("/subscription");
          });
        } else {
          router.push("/subscription");
        }

        return;
      }
    }
  }, [shouldFetch, userData, userLoading, error, router, loggedInDynamicRoutes]);

  if (userLoading) return <Spinner />;

  return children;
};

export default PrivateRoute;
