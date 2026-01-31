import React from 'react';
import Navbar from './Navbar';

/**
 * Layout component - For protected pages (Dashboard, Signals)
 * Contains Navbar. Footer is handled by LandingPage directly.
 */
const Layout = ({ children, showNavbar = true }) => {
  return (
    <div className="layout bg-[#020408] min-h-screen">
      {showNavbar && <Navbar />}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
