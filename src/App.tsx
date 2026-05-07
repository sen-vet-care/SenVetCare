/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DrLilyWidget } from './components/ui/DrLilyWidget';
import { WhatsAppFloatingButton } from './components/ui/WhatsAppFloatingButton';
import ScrollToTop from './components/ui/ScrollToTop';

// Import pages
import { HomePage } from './pages/HomePage';

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Lazy load other pages
const StoriesPage = lazy(() => import('./pages/StoriesPage').then(m => ({ default: m.StoriesPage })));
const PharmacyPage = lazy(() => import('./pages/PharmacyPage').then(m => ({ default: m.PharmacyPage })));
const DiagnosticsPage = lazy(() => import('./pages/DiagnosticsPage').then(m => ({ default: m.DiagnosticsPage })));
const TreatmentsPage = lazy(() => import('./pages/TreatmentsPage').then(m => ({ default: m.TreatmentsPage })));
const PreventionsPage = lazy(() => import('./pages/PreventionsPage').then(m => ({ default: m.PreventionPage })));
const PortalLoginPage = lazy(() => import('./pages/PortalLoginPage').then(m => ({ default: m.PortalLoginPage })));
const DrLilyPage = lazy(() => import('./pages/DrLilyPage').then(m => ({ default: m.DrLilyPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const PetSafetyGuidePage = lazy(() => import('./pages/PetSafetyGuidePage').then(m => ({ default: m.PetSafetyGuidePage })));
const CareersPage = lazy(() => import('./pages/CareersPage').then(m => ({ default: m.CareersPage })));
const BookingPage = lazy(() => import('./pages/BookingPage').then(m => ({ default: m.BookingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));

const SectionLoader = () => (
  <div className="w-full py-20 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-clinical-bg text-on-background flex flex-col relative">
      {/* Divine Ethereal Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full mix-blend-screen animate-breathe opacity-80"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-waiting-gold/5 blur-[120px] rounded-full mix-blend-screen animate-breathe opacity-60" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="z-10 flex flex-col flex-grow relative">
        <ScrollToTop />
        <Navbar />
        
        <Suspense fallback={<SectionLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/pharmacy" element={<PharmacyPage />} />
            <Route path="/diagnostics" element={<DiagnosticsPage />} />
            <Route path="/treatments" element={<TreatmentsPage />} />
            <Route path="/preventions" element={<PreventionsPage />} />
            <Route path="/dr-lily" element={<DrLilyPage />} />
            <Route path="/portal-login" element={<PortalLoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/pet-safety-guide" element={<PetSafetyGuidePage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/book" element={<BookingPage />} />
          </Routes>
        </Suspense>

        <DrLilyWidget />
        <WhatsAppFloatingButton />
        <Footer />
        <Analytics />
        <SpeedInsights />
      </div>
    </div>
  );
}
