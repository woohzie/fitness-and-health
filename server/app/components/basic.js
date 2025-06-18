import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export function TextInput({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  pattern = '',
  className = '',
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType  = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-bold text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          pattern={pattern}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
            className
          } ${isPassword ? 'pr-10' : ''}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            {
              showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )
            }
          </button>
        )}
      </div>
    </div>
  );
}

export function Button({ children, onClick, type = 'button', className = '', width, height}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-${width} h-${height} px-4 py-2 bg-[linear-gradient(to_right,_#EB2CFC,_#62CCFA)] hover:bg-[linear-gradient(to_right,_#D10FE8,_#4FB8E8)] transition-colors duration-300 ease-in-out text-white rounded-lg hover:bg-blue-700 transition duration-200 hover:cursor-pointer font-bold ${className}`}
    >
      {children}
    </button>
  );
}

export function BackButton({ onClick, type = 'button', className = '', width, height}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`p-2 bg-[linear-gradient(to_right,_#EB2CFC,_#62CCFA)] rounded-full shadow-lg hover:bg-[linear-gradient(to_right,_#D10FE8,_#4FB8E8)] focus:outline-none transition-all duration-300 ease-in-out ${className}`}
    >
      <ArrowLeft className="w-5 h-5 text-white" />
    </button>
  );
}