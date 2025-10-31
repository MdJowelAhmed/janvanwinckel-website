"use client";
import { usePathname } from "next/navigation";
import PrivateRoute from "./PrivateRoute";

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();

  // Static public routes
  const publicRoutes = [
    "/login",
    "/about",
    "/forgot-password",
    "/otp-verify",
    "/reset-password",
    "/user-create",
    "/subscription",
    "/pigeon-database",
    "/",
    "/register",
    // "/profile-dashboard",
    "/contact",
    "/about-us",
    "/terms",
  ];

  // Dynamic routes accessible without login
  const publicDynamicRoutes = [];

  // Dynamic routes accessible only for logged-in users (any role)
  const loggedInDynamicRoutes = ["/pigeon-overview/", "/pedigree-chart/", ];

  const isPublicPage =
    publicRoutes.includes(pathname) ||
    publicDynamicRoutes.some((route) => pathname.startsWith(route));

  return isPublicPage ? (
    children
  ) : (
    <PrivateRoute loggedInDynamicRoutes={loggedInDynamicRoutes}>
      {children}
    </PrivateRoute>
  );
};

export default LayoutWrapper;
