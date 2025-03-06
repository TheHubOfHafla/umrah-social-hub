
import React from "react";
import Footer from "./Footer";

interface PageWrapperProps {
  children: React.ReactNode;
  withFooter?: boolean;
  className?: string;
}

const PageWrapper = ({ 
  children, 
  withFooter = true, 
  className = "" 
}: PageWrapperProps) => {
  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      <main className="flex-grow">
        {children}
      </main>
      {withFooter && <Footer />}
    </div>
  );
};

export default PageWrapper;
