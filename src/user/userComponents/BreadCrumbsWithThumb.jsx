// src/pages/user/userComponents/BreadcrumbWithThumb.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Props:
 * - service: object ({ name, mainImage: { url }, category })
 * - category: string (optional)
 * - onGoDashboard: optional handler (overrides internal navigate)
 * - onGoCategory: optional handler (overrides internal navigate)
 */
export default function BreadcrumbWithThumb({ service, category, onGoDashboard, onGoCategory }) {
  const navigate = useNavigate();
  const goDashboard = onGoDashboard ?? (() => navigate("/user", { state: { view: "dashboard" } }));
  const goCategory = onGoCategory ?? (() => navigate("/user", { state: { view: "services", category } }));

  const thumb = service?.mainImage?.url;
  const label = service?.name ?? (category ? category.replace(/_/g, " ") : "Services");

  return (
    <nav className="flex items-center text-sm font-medium text-gray-600 gap-3">
      <button onClick={goDashboard} className="text-xs font-medium text-gray-600 hover:text-gray-800">
        Dashboard
      </button>

      <ChevronRight className="h-4 w-4 text-gray-400" />

      <button onClick={goCategory} className="text-xs font-medium text-gray-600 hover:text-gray-800">
        {category ? category.replace(/_/g, " ") : "Services"}
      </button>

      <ChevronRight className="h-4 w-4 text-gray-400" />

      <div className="flex items-center gap-3">
        {thumb ? (
          <img src={thumb} alt={label} className="w-7 h-7 rounded-md object-cover border" />
        ) : (
          <div className="w-7 h-7 rounded-md bg-gray-100 border" />
        )}
        <span className="text-gray-800 font-semibold">{label}</span>
      </div>
    </nav>
  );
}
