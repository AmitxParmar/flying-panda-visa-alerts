import 'dotenv/config';
import { PrismaClient, VisaType, AlertStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Sample data
const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'Singapore', 'UAE', 'Netherlands'];
const cities = {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Francisco'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    'Germany': ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne'],
    'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya'],
    'Singapore': ['Singapore'],
    'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah'],
    'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'],
};

const visaTypes: VisaType[] = [VisaType.Tourist, VisaType.Business, VisaType.Student];
const statuses: AlertStatus[] = [AlertStatus.Active, AlertStatus.Booked, AlertStatus.Expired];

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
    console.log('🌱 Starting seed...');

    // First, find a user to assign alerts to (alerts don't have userId in schema, so skip this)
    // If you need to add userId later, uncomment this
    // const user = await prisma.user.findFirst();
    // if (!user) {
    //   console.error('No user found. Please create a user first (register via API).');
    //   process.exit(1);
    // }

    // Clear existing alerts
    console.log('🗑️  Clearing existing alerts...');


    // Generate 200 alerts
    console.log('📝 Generating 200 alerts...');
    const alerts = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date();

    for (let i = 0; i < 200; i++) {
        const country = getRandomElement(countries);
        const city = getRandomElement(cities[country as keyof typeof cities]);
        const visaType = getRandomElement(visaTypes);
        const status = getRandomElement(statuses);
        const createdAt = getRandomDate(startDate, endDate);

        alerts.push({
            country,
            city,
            visaType,
            status,
            createdAt,
        });
    }

    // Batch insert for better performance
    console.log('💾 Inserting alerts into database...');
    await prisma.visaAlert.createMany({
        data: alerts,
    });

    const count = await prisma.visaAlert.count();
    console.log(`✅ Successfully seeded ${count} alerts!`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
