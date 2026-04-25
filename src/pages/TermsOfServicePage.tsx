import React from 'react';

export const TermsOfServicePage = () => {
  return (
    <main className="py-32 max-w-[800px] mx-auto px-6 relative flex-grow bg-surface-container-low min-h-screen">
      <header className="mb-16">
        <h1 className="font-manrope font-extrabold text-[48px] text-ink-depth mb-6">Terms of Service</h1>
        <p className="font-inter text-lg text-on-surface-variant font-light">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <div className="prose prose-invert max-w-none font-inter text-on-surface-variant leading-relaxed">
        <p className="mb-6">
          Welcome to SenVetCare ("Dr. Tamal B. Sen Memorial Veterinary Clinic"). By accessing or using our services, website, or clinic facilities, you agree to be bound by these Terms of Service.
        </p>
        
        <h2 className="font-manrope font-bold text-2xl text-ink-depth mt-10 mb-4">1. Veterinary Services</h2>
        <p className="mb-6">
          We strive to provide the highest standard of veterinary care. However, medical outcomes cannot be guaranteed. Emergency triage and treatment prioritize immediate life-saving procedures as determined by our veterinary medical professionals.
        </p>

        <h2 className="font-manrope font-bold text-2xl text-ink-depth mt-10 mb-4">2. Appointments and Cancellations</h2>
        <p className="mb-6">
          We respect your time and request the same in return. Please provide at least 24 hours notice for appointment cancellations. Late cancellations or no-shows may incur a fee. Emergency cases take precedence and may cause delays to scheduled appointments.
        </p>

        <h2 className="font-manrope font-bold text-2xl text-ink-depth mt-10 mb-4">3. Payments and Billing</h2>
        <p className="mb-6">
          Payment is required at the time services are rendered. We accept cash, credit/debit cards, and approved digital payment methods. For hospitalized patients or significant treatments, an initial deposit may be required prior to treatment initiation.
        </p>

        <h2 className="font-manrope font-bold text-2xl text-ink-depth mt-10 mb-4">4. Pet Safety Guidelines</h2>
        <p className="mb-6">
          For the safety of all patients and staff, all dogs must be properly leashed, and all cats must be secured in appropriate carriers while inside the clinic and waiting areas, regardless of their temperament.
        </p>

        <h2 className="font-manrope font-bold text-2xl text-ink-depth mt-10 mb-4">5. Amendments</h2>
        <p className="mb-6">
          We reserve the right to modify these terms at any time. Significant changes will be communicated via our website or directly to registered clients. Continued use of our services constitutes acceptance of the modified terms.
        </p>
      </div>
    </main>
  );
};
