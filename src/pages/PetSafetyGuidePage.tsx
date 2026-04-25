import React from 'react';
import { Link } from 'react-router-dom';

export const PetSafetyGuidePage = () => {
  return (
    <main className="py-32 max-w-[800px] mx-auto px-6 relative flex-grow bg-surface-container-low min-h-screen">
      <header className="mb-16">
        <h1 className="font-manrope font-extrabold text-[48px] text-ink-depth mb-6">Pet <span className="bg-clip-text text-transparent bg-gradient-to-r from-pharmacy-green to-white">Safety Guide.</span></h1>
        <p className="font-inter text-lg text-on-surface-variant font-light">Essential information for keeping your pets safe and healthy at home and in our clinic.</p>
      </header>

      <div className="space-y-12">
        <section className="bg-surface border border-outline-variant/30 p-8 rounded-3xl">
            <h2 className="font-manrope font-bold text-2xl text-ink-depth mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-pharmacy-green">home</span> At-Home Hazards
            </h2>
            <ul className="list-disc list-inside space-y-3 font-inter text-on-surface-variant">
                <li><strong className="text-white">Toxic Foods:</strong> Keep chocolate, grapes, raisins, onions, garlic, and products containing xylitol (an artificial sweetener) completely out of reach.</li>
                <li><strong className="text-white">Household Plants:</strong> Lilies, sago palms, oleander, and aloe vera can be highly toxic. Verify plant safety before bringing them indoors.</li>
                <li><strong className="text-white">Medications:</strong> Never administer human medications to pets without direct veterinary guidance. Ibuprofen and acetaminophen are lethal.</li>
            </ul>
        </section>

        <section className="bg-surface border border-outline-variant/30 p-8 rounded-3xl">
            <h2 className="font-manrope font-bold text-2xl text-ink-depth mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">local_hospital</span> Clinic Protocol
            </h2>
            <ul className="list-disc list-inside space-y-3 font-inter text-on-surface-variant">
                <li><strong className="text-white">Carriers & Leashes:</strong> All cats must be in secure carriers. All dogs must be on a strong leash. This prevents stress-induced conflicts in the waiting area.</li>
                <li><strong className="text-white">Vaccination Records:</strong> Keep your pet's vaccination records up to date. Bring the physical booklet or digital copy to your appointments.</li>
            </ul>
        </section>
        
        <section className="bg-surface border border-outline-variant/30 p-8 rounded-3xl">
            <h2 className="font-manrope font-bold text-2xl text-ink-depth mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-error">emergency</span> Recognizing Emergencies
            </h2>
            <p className="font-inter text-on-surface-variant mb-4">Immediate veterinary attention is required if your pet exhibits:</p>
            <ul className="list-disc list-inside space-y-3 font-inter text-on-surface-variant mb-6">
                <li>Difficulty breathing or continuous coughing</li>
                <li>Inability to urinate or defecate</li>
                <li>Seizures or sudden collapse</li>
                <li>Unexplained bleeding or suspected poisoning</li>
            </ul>
            <Link to="/#emergency" className="inline-block bg-error/10 text-error border border-error/30 px-6 py-3 rounded-full font-inter font-bold text-sm tracking-widest uppercase hover:bg-error hover:text-white transition-colors">
                Emergency Information
            </Link>
        </section>
      </div>
    </main>
  );
};
