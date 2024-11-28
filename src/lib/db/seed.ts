import connectDB from './mongodb';
import Region from '../models/Region';
import Department from '../models/Department';

const regions = [
  { code: '11', name: 'Île-de-France', slug: 'ile-de-france' },
  { code: '24', name: 'Centre-Val de Loire', slug: 'centre-val-de-loire' },
  { code: '27', name: 'Bourgogne-Franche-Comté', slug: 'bourgogne-franche-comte' },
  { code: '28', name: 'Normandie', slug: 'normandie' },
  { code: '32', name: 'Hauts-de-France', slug: 'hauts-de-france' },
  { code: '44', name: 'Grand Est', slug: 'grand-est' },
];

const departments = [
  { code: '75', name: 'Paris', region_code: '11', slug: 'paris' },
  { code: '77', name: 'Seine-et-Marne', region_code: '11', slug: 'seine-et-marne' },
  { code: '78', name: 'Yvelines', region_code: '11', slug: 'yvelines' },
  { code: '91', name: 'Essonne', region_code: '11', slug: 'essonne' },
  { code: '92', name: 'Hauts-de-Seine', region_code: '11', slug: 'hauts-de-seine' },
  { code: '93', name: 'Seine-Saint-Denis', region_code: '11', slug: 'seine-saint-denis' },
];

export async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    await Region.deleteMany({});
    await Department.deleteMany({});

    // Insert new data
    await Region.insertMany(regions);
    await Department.insertMany(departments);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
