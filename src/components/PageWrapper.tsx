
import React from "react";
import Footer from "./Footer";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  withFooter?: boolean;
  className?: string;
  containerClassName?: string;
  withPadding?: boolean;
  background?: "default" | "gradient" | "subtle" | "none";
}

const PageWrapper = ({ 
  children, 
  withFooter = true, 
  className = "",
  containerClassName = "",
  withPadding = true,
  background = "default"
}: PageWrapperProps) => {
  return (
    <div className={cn(
      "flex flex-col min-h-screen w-full",
      {
        "bg-background": background === "default",
        "bg-gradient-warm": background === "gradient",
        "bg-secondary/30": background === "subtle",
      },
      className
    )}>
      <main className={cn(
        "flex-grow w-full",
        withPadding && "pt-20 pb-10",
        containerClassName
      )}>
        {children}
      </main>
      {withFooter && <Footer />}
    </div>
  );
};

export default PageWrapper;
