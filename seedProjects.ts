import prisma from './src/lib/prisma';

const projects = [
  {
    title: 'National Data Center Setup',
    category: 'Mission Critical Infrastructure',
    description: 'Complete design and installation of FM200 fire suppression, biometric access control, and continuous power supply systems for a Tier 3 data center.',
    location: 'Accra, Ghana',
    date: '2023',
    imagePath: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop',
    order: 1,
  },
  {
    title: 'Bank Headquarters Security Integration',
    category: 'Electronic Security',
    description: 'Deployed an enterprise-level CCTV surveillance network and integrated access control across a 12-story financial headquarters.',
    location: 'Ridge, Accra',
    date: '2022',
    imagePath: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    order: 2,
  },
  {
    title: 'Industrial Manufacturing Plant',
    category: 'Fire Engineering',
    description: 'Installation of industrial-grade fire hydrants, sprinkler systems, and advanced smoke detection arrays for a 50,000 sq ft manufacturing facility.',
    location: 'Tema, Ghana',
    date: '2023',
    imagePath: '/images/projects/manufacturing-plant.png',
    order: 3,
  },
  {
    title: 'Government Administrative Complex',
    category: 'Electrical Systems',
    description: 'Comprehensive electrical rewiring and installation of smart energy management systems for a major government complex.',
    location: 'Ministries, Accra',
    date: '2021',
    imagePath: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2070&auto=format&fit=crop',
    order: 4,
  },
  {
    title: 'Commercial Retail Mall',
    category: 'Integrated Solutions',
    description: 'Turnkey engineering solution encompassing fire alarms, PA systems, and emergency lighting across a multi-level shopping destination.',
    location: 'Kumasi, Ghana',
    date: '2024',
    imagePath: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop',
    order: 5,
  },
  {
    title: 'Luxury Residential Apartments',
    category: 'Fire Engineering',
    description: 'State-of-the-art addressable fire alarm systems and rapid-response suppression units installed for a luxury high-rise development.',
    location: 'Cantonments, Accra',
    date: '2023',
    imagePath: '/images/projects/luxury-residential.png',
    order: 6,
  }
];

async function main() {
  console.log('Seeding projects...');
  for (const project of projects) {
    await prisma.project.create({
      data: project,
    });
  }
  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
