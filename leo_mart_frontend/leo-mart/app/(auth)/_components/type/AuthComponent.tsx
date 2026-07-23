import React from "react";

export function LeoMartLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2 font-extrabold tracking-tight text-gray-900 select-none">
      <img
        src="/logo.png"
        alt="Leo Mart"
        style={{ height: size, width: "auto" }}
        className="object-contain"
      />
      <span style={{ fontSize: size * 0.8 }} className="text-purple-600 font-extrabold tracking-wider">
        Leo Mart
      </span>
    </div>
  );
}
