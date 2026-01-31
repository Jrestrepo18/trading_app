import React from 'react';
import { Hero, LiveResults, HowItWorks, FeaturesGrid, PricingSection, ExperienceMilestone } from '../features/landing';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * LandingPage - Main landing page
 * Combines all landing sections into a single page
 */
const LandingPage = () => {
    return (
        <div className="bg-[#0A0C10] min-h-screen font-sans">
            <Navbar />
            <Hero />
            <ExperienceMilestone />
            <LiveResults />
            <HowItWorks />
            <FeaturesGrid />
            <PricingSection />
            <Footer />
        </div>
    );
};

export default LandingPage;
