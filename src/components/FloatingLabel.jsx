import React, { useState } from "react"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export const FloatingLabel = ({
  label,
  value,
  error,
  icon: Icon,
  type = "text",
  showPassword,
  onTogglePassword,
  onChange,
  onFocus,
  onBlur,
  placeholder = "",
  disabled = false,
  required = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value && value.length > 0
  const shouldFloat = isFocused || hasValue

  const handleFocus = (e) => {
    setIsFocused(true)
    if (onFocus) onFocus(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    if (onBlur) onBlur(e)
  }

  const inputStyles = `
    pl-12 pr-12 pt-6 pb-2 h-14 bg-gray-50 border rounded-xl w-full
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
    hover:bg-white hover:border-gray-400
    ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-300"}
    ${shouldFloat ? "pt-6 pb-2" : "py-4"}
    shadow-sm hover:shadow-md
    ${isFocused ? "shadow-lg bg-white" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
    font-medium text-gray-900
  `

  const labelStyles = `
    absolute left-12 pointer-events-none transition-all duration-300 ease-out select-none
    ${shouldFloat
      ? "top-2 text-xs font-medium"
      : "top-1/2 transform -translate-y-1/2 text-base"
    }
    ${shouldFloat && !error ? "text-blue-600" : shouldFloat && error ? "text-red-500" : "text-gray-500"}
    ${disabled ? "opacity-50" : ""}
  `

  return (
    <div className="relative group w-full">
      <div className="relative">
        {/* Left Icon - Show for all field types including password */}
        {Icon && (
          <Icon className={`
            absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10
            transition-colors duration-200
            ${isFocused ? "text-blue-600" : error ? "text-red-500" : "text-gray-400"}
            ${disabled ? "opacity-50" : ""}
          `} />
        )}

        {/* Input Field */}
        <input
          {...props}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'textfield'
          }}
          className={`
            ${type === "password" ? "pl-12 pr-12" : Icon ? "pl-12 pr-4" : "pl-4 pr-4"} 
            pt-6 pb-2 h-14 bg-gray-50 border rounded-xl w-full
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
            hover:bg-white hover:border-gray-400
            ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-300"}
            ${shouldFloat ? "pt-6 pb-2" : "py-4"}
            shadow-sm hover:shadow-md
            ${isFocused ? "shadow-lg bg-white" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
             text-gray-900
            password-field
          `}
          placeholder=""
          autoComplete={type === "password" ? "current-password" : "off"}
        />

        {/* Right Icon (Password Toggle) - Only for password fields */}
        {type === "password" && (
          <button
            type="button"
            onClick={onTogglePassword}
            disabled={disabled}
            className={`
              absolute right-3 top-1/2 transform -translate-y-1/2 z-10
              transition-colors duration-200
              ${disabled ? "opacity-50 cursor-not-allowed" : "hover:text-blue-600 cursor-pointer"}
              ${isFocused ? "text-blue-600" : "text-gray-400"}
            `}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}

        {/* Floating Label */}
        <label className={`
          absolute pointer-events-none transition-all duration-300 ease-out select-none
          ${Icon ? "left-12" : "left-4"}
          ${shouldFloat
            ? "top-2 text-xs font-medium"
            : "top-1/2 transform -translate-y-1/2 text-base"
          }
          ${shouldFloat && !error ? "text-blue-600" : shouldFloat && error ? "text-red-500" : "text-gray-500"}
          ${disabled ? "opacity-50" : ""}
        `}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-500 text-sm animate-slideIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        /* Hide browser's built-in password toggle */
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
        
        input[type="password"]::-webkit-textfield-decoration-container {
          display: none;
        }
        
        .password-field::-webkit-credentials-auto-fill-button {
          display: none !important;
        }
        
        .password-field::-webkit-strong-password-auto-fill-button {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
