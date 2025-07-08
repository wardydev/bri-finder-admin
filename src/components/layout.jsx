import React from "react";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      {children}
    </div>
  );
}
