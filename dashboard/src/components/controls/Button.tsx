import React from "react";

interface ButtonParams {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "normal" | "destructive" | "warning" | "success";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export function Button({
  children,
  size = "md",
  variant = "normal",
  className,
  onClick = () => null,
  disabled = false,
}: ButtonParams) {
  const base = "rounded-md text-white disabled:opacity-30 hover:shadow-xl";

  const normalVariant = "bg-blue hover:bg-blue-hover disabled:bg-opacity-50";
  const defaultVariant = "bg-blue hover:bg-blue-hover disabled:bg-opacity-50";
  const warningVariant = "bg-warning bg-opacity-80 hover:bg-opacity-100 disabled:bg-opacity-50";
  const destructiveVariant = "bg-red hover:bg-red-hover disabled:bg-opacity-50";
  const variantStyle =
    variant === "normal"
      ? normalVariant
      : variant === "destructive"
      ? destructiveVariant
      : variant === "warning"
      ? warningVariant
      : defaultVariant;

  const small = "px-2 py-1 text-xs font-semibold";
  const medium = "px-3 py-2 text-md font-semibold";
  const large = "px-4 py-3 text-lg font-semibold";
  const sizeStyle = size === "sm" ? small : size === "lg" ? large : medium;

  return (
    <button className={`${base} ${variantStyle} ${sizeStyle} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
