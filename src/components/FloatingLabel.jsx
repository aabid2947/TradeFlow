import { useState } from "react"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

import { Input } from "@/components/ui/input"

export const FloatingLabel = ({
  label,
  value,
  error,
  icon: Icon,
  type = "text",
  showPassword,
  onTogglePassword,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value.length > 0
  const shouldFloat = isFocused || hasValue


  return (
    <div className="relative group">
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200 group-focus-within:text-[#1987BF] z-10" />
        <input
          {...props}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
    pl-12 pr-12 pt-6 pb-2 h-14 bg-gray-50/80 border rounded-xl w-full
    transition-all duration-200 ease-[cubic-bezier(0.33,1,0.68,1)]
    focus:outline-none focus:ring-4 focus:ring-[#1987BF]/20 focus:border-[#1987BF]/90
    hover:bg-white hover:border-gray-300
    ${error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-gray-300"}
    ${shouldFloat ? "pt-6 pb-2" : "py-4"}
    shadow-sm hover:shadow-md
    ${isFocused ? "shadow-lg" : ""}
  `}
          placeholder=""
        />
        {type === "password" && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1987BF] transition-colors duration-200 z-10"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}

        <label
          className={`
            absolute left-12 pointer-events-none transition-all duration-300 ease-out
            ${shouldFloat
              ? "top-2 text-xs text-[#1987BF] font-medium"
              : "top-1/2 transform -translate-y-1/2 text-gray-500"
            }
            ${error && shouldFloat ? "text-red-500" : ""}
          `}
        >
          {label}
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-500 text-sm animate-in slide-in-from-left-2 duration-300">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  )
}
