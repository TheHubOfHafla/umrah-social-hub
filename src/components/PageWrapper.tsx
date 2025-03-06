
import React from "react";
import Footer from "./Footer";

interface PageWrapperProps {
  children: React.ReactNode;
  withFooter?: boolean;
}

const PageWrapper = ({ children, withFooter = true }: PageWrapperProps) => {
  return (
    <>
      {children}
      {withFooter && <Footer />}
    </>
  );
};

export default PageWrapper;
