import React from 'react';

export const PrivacyPolicyPage = () => {
  return (
    <main className="py-32 max-w-[800px] mx-auto px-6 relative flex-grow bg-surface-container-low min-h-screen">
      <header className="mb-16">
        <h1 className="font-manrope font-extrabold text-[48px] text-ink-depth mb-6">Privacy Policy</h1>
        <p className="font-inter text-lg text-on-surface-variant font-light">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <div className="prose prose-invert max-w-none font-inter text-on-surface-variant leading-relaxed">
        <p className="mb-6">
          At SenVetCare ("Dr. Tamal B. Sen Memorial Veterinary Clinic"), we are committed to protecting your privacy and ensuring the security of your personal and pet-related information. This Privacy Policy outlines how we collect, use, and safeguard your data.
        </p>
        
        <h2 className="font-manrope font-bold text-2xl text-ink-depth mt-10 mb-4">1. Information We Collect</h2>
        <p className="mb-6">
          We may collect personal information such as your name, contact details, email address, and payment information when you register, book an appointment, or use our services. We also collect specific medical history, diagnostic, and treatment data for your pets.
        </p>

        <h2 className="font-manrope font-bold text-2xl text-ink-depth mt-10 mb-4">2. How We Use Your Information</h2>
        <p className="mb-6">
          Your data is utilized primarily to provide top-tier veterinary care, manage appointments, process billing, and communicate with you regarding your pet's health. We may also use anonymized data to improve our clinical practices and services.
        </p>

        <h2 className="font-manrope font-bold text-2xl text-ink-depth mt-10 mb-4">3. Data Sharing and Security</h2>
        <p className="mb-6">
          We do not sell or rent your personal information to third parties. We may share information with trusted third-party service providers (like diagnostic labs) solely for the purpose of providing veterinary services. All data is stored securely using industry-standard encryption and security protocols.
        </p>

        <h2 className="font-manrope font-bold text-2xl text-ink-depth mt-10 mb-4">4. Your Rights</h2>
        <p className="mb-6">
          You have the right to request access to the personal data we hold about you and your pet. You may also request corrections to this data or ask for its deletion, subject to legal and regulatory requirements governing medical records.
        </p>

        <h2 className="font-manrope font-bold text-2xl text-ink-depth mt-10 mb-4">Contact Us</h2>
        <p className="mb-6">
          If you have any questions or concerns about this Privacy Policy, please contact us at drtbsmemorialvetclinic@gmail.com.
        </p>
      </div>
    </main>
  );
};
