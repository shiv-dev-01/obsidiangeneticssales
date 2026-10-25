import React from "react";
import { useAuthStore } from "../../store/authStore";
import logo from "../../src/assets/logo.png";

export function LoginHeader() {
  const { user } = useAuthStore();
  const permission = user?.is_permission;

  return (
    <div className="flex justify-center items-center gap-8">
      <center>
        <img
          src={logo}
          alt="WhiteLabelMD Logo"
          className="h-12 w-auto logo_my"
        />
      </center>
    </div>
  );
}
