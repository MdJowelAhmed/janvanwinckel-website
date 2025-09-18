import React from "react";

const AuthLayout = ({ children }) => {
  const bgImage = "https://i.ibb.co.com/WpnfSfZb/Log-in.png";

  return (
    <div className="w-full min-h-screen relative">
      {/* Background Image with opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          opacity: 0.7, 
        }}
      ></div>

      {/* Gradient Overlay (optional) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
};

export default AuthLayout;
