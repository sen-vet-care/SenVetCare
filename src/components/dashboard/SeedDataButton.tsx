import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const DEMO_DOCTORS = [
  { name: 'Dr. Chandreyee Sen', specialty: 'Clinical Medicine', days: 'Mon, Wed, Fri', timings: '06:00 PM - 08:00 PM', isPresent: true },
  { name: 'Dr. Bithi Roy Chowdhury', specialty: 'Veterinary Surgeon', days: 'Tue, Thu, Sat', timings: '06:00 PM - 08:00 PM', isPresent: true },
  { name: 'Dr. Arnab Maji', specialty: 'Veterinary Surgery', days: 'Mon - Fri', timings: '06:00 AM - 09:00 AM', isPresent: true },
  { name: 'Dr. I. Murty', specialty: 'Feline Medicine', days: 'Mon-Fri', timings: '10:00 AM - 06:00 PM', isPresent: true },
];

const DEMO_RECORDS = [
  { petName: 'Buddy', species: 'Dog', doctorName: 'Dr. Chandreyee Sen', date: new Date().toISOString(), type: 'General Checkup', notes: 'Patient is healthy, gave multivitamin supplements.', weight: '12.5 kg', nextVisit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() },
  { petName: 'Luna', species: 'Cat', doctorName: 'Dr. I. Murty', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), type: 'Feline Vaccination', notes: 'Administered annual FVRCP vaccine. Mild fever expected.', weight: '4.2 kg', nextVisit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString() },
  { petName: 'Max', species: 'Dog', doctorName: 'Dr. Arnab Maji', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), type: 'Surgery Follow-up', notes: 'Incision site healing well. Sutures removed.', weight: '22.0 kg', nextVisit: null },
  { petName: 'Bella', species: 'Dog', doctorName: 'Dr. Bithi Roy Chowdhury', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), type: 'Skin Condition', notes: 'Prescribed anti-fungal shampoo and ointment for dermatitis on hind legs.', weight: '8.5 kg', nextVisit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString() },
];

const DEMO_SERVICES = [
  { name: 'General Consultation', description: 'Comprehensive health checkup for your pet.', rate: 500, available: true },
  { name: 'Vaccination Package', description: 'Standard annual vaccines including Rabies and DHLPP.', rate: 1200, available: true },
  { name: 'Dental Scaling', description: 'Professional teeth cleaning and scaling under sedation.', rate: 2500, available: true },
  { name: 'X-Ray & Imaging', description: 'Digital radiography for precise diagnostics.', rate: 1500, available: true },
  { name: 'Microchipping', description: 'Safe and permanent identification for your pet.', rate: 800, available: true },
];

const DEMO_PETS = [
  { petName: 'Buddy', species: 'Dog', breed: 'Golden Retriever', ownerId: 'demo1', ownerEmail: 'demo1@example.com', createdAt: new Date().toISOString() },
  { petName: 'Luna', species: 'Cat', breed: 'Siamese', ownerId: 'demo2', ownerEmail: 'demo2@example.com', createdAt: new Date().toISOString() },
  { petName: 'Max', species: 'Dog', breed: 'German Shepherd', ownerId: 'demo3', ownerEmail: 'demo3@example.com', createdAt: new Date().toISOString() },
  { petName: 'Bella', species: 'Dog', breed: 'Poodle', ownerId: 'demo4', ownerEmail: 'demo4@example.com', createdAt: new Date().toISOString() },
  { petName: 'Charlie', species: 'Cat', breed: 'Maine Coon', ownerId: 'demo5', ownerEmail: 'demo5@example.com', createdAt: new Date().toISOString() },
];

const DEMO_APPOINTMENTS = [
  { petName: 'Buddy', ownerName: 'Alice', date: '2023-11-15', time: '10:30 AM', reason: 'Annual Checkup', status: 'Scheduled' },
  { petName: 'Luna', ownerName: 'Bob', date: '2023-11-16', time: '11:00 AM', reason: 'Vaccination', status: 'Scheduled' },
  { petName: 'Max', ownerName: 'Charlie', date: '2023-11-15', time: '02:00 PM', reason: 'Skin infection', status: 'Completed' },
  { petName: 'Bella', ownerName: 'David', date: '2023-11-17', time: '04:00 PM', reason: 'Dental Check', status: 'Scheduled' },
  { petName: 'Charlie', ownerName: 'Eve', date: '2023-11-18', time: '09:30 AM', reason: 'Limping', status: 'Scheduled' },
];

export const SeedDataButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const seedData = async () => {
    setLoading(true);
    setMessage('Seeding data...');
    try {
      for (const doctor of DEMO_DOCTORS) {
        await addDoc(collection(db, 'doctors'), doctor);
      }
      for (const service of DEMO_SERVICES) {
        await addDoc(collection(db, 'services'), service);
      }
      for (const pet of DEMO_PETS) {
        await addDoc(collection(db, 'pets'), pet);
      }
      for (const appt of DEMO_APPOINTMENTS) {
        await addDoc(collection(db, 'appointments'), appt);
      }
      for (const rec of DEMO_RECORDS) {
        await addDoc(collection(db, 'medical_records'), rec);
      }
      setMessage('Demo data seeded successfully!');
    } catch (error: any) {
      console.error('Error seeding data:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-6 bg-blue-50 border border-blue-100 rounded-2xl mt-6">
      <div>
        <h4 className="font-manrope font-bold text-blue-700 text-lg">Demo Data</h4>
        <p className="font-inter text-sm text-blue-600/80 max-w-md">Click this button to add 5 demo records for doctors, services, pets, and appointments to the database.</p>
        {message && <p className="text-sm font-bold mt-2 text-indigo-700">{message}</p>}
      </div>
      <button 
        onClick={seedData} 
        disabled={loading}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition disabled:opacity-50"
      >
        {loading ? 'Seeding...' : 'Seed Data'}
      </button>
    </div>
  );
};
