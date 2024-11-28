import { seedDatabase } from '../src/lib/db/seed';

async function main() {
  try {
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error running seed script:', error);
    process.exit(1);
  }
}

main();
