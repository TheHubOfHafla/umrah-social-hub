
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export const Container = ({ 
  children, 
  className, 
  size = "lg",
  ...props 
}: ContainerProps) => {
  return (
    <div 
      className={cn(
        "mx-auto px-4 md:px-6 lg:px-8",
        {
          "max-w-screen-sm": size === "sm",
          "max-w-screen-md": size === "md",
          "max-w-screen-lg": size === "lg",
          "max-w-screen-xl": size === "xl",
          "w-full": size === "full",
        },
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};
