/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DrLilyWidget } from './components/ui/DrLilyWidget';
import { HeroReception } from './sections/HeroReception';
import { PharmacyServices } from './sections/PharmacyServices';
import { DiagnosticsLab } from './sections/DiagnosticsLab';
import { OurDoctors } from './sections/OurDoctors';
import { EmergencyBooking } from './sections/Emergency';
import { BlogInsights } from './sections/BlogInsights';
import { AboutLegacy } from './sections/AboutLegacy';
import { ContactSupport } from './sections/ContactSupport';

export default function App() {
  return (
    <div className="min-h-screen bg-clinical-bg text-on-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroReception />
        <PharmacyServices />
        <DiagnosticsLab />
        <OurDoctors />
        <AboutLegacy />
        <EmergencyBooking />
        <BlogInsights />
        <ContactSupport />
      </main>

      <DrLilyWidget />
      <Footer />
    </div>
  );
}
