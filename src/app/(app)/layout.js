import React from "react";

export default function Layout({ children }) {
  return (
    <main className="bg-slate-400 h-screen flex flex-col p-4">{children}</main>
  );
}
