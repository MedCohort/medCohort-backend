const { PrismaClient}  = require('@prisma/client')
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient()

// async function clientFaker(nums) {

//     for(let i = 0;i < nums; i++){
//         const client = await prisma.client.create({
//             data: {
//                 fullNames: faker.person.fullName(),
//                 username: faker.internet.userName(),
//                 email: faker.internet.email(),
//                 password: faker.internet.password(),
//                 tel: faker.phone.number(),
//             },
//         })
//         console.log('Client created:', client)
//         if(nums <= 0) break
//     }
// }



// async function AdminFaker(nums) {

//     for(let i = 0;i < nums; i++){
//         const client = await prisma.admin.create({
//             data: {
//                 name: faker.internet.userName(),
//                 email: faker.internet.email(),
//                 password: faker.internet.password(),
//                 lastLogin: faker.date.past(),
//             },
//         })
//         console.log(' created Admin:', client)
//     }
// }



async function AssignmentFaker(nums) {

    for(let i = 0;i < nums; i++){
        const client = await prisma.assignment.create({
            data: {
                title: faker.lorem.sentence(),
                description: faker.lorem.paragraph(),
                deadline: faker.helpers.arrayElement(['DEFAULT_DEADLINE', 'TWELVE_HOURS', 'TWENTY_FOUR_HOURS', 'TWO_DAYS', 'THREE_DAYS', 'FIVE_DAYS']),
                instructions: faker.lorem.paragraph(),
                files: [
                    "assignment1.docx",
                    "research_paper.pdf",
                  ],
                pages: faker.number.int({ min: 1, max: 100 }),
                typeOfPaper: faker.lorem.word(),
                discipline: faker.helpers.arrayElement([
                    'ENGLISH_LITERATURE',
                    'BUSINESS_MANAGEMENT',
                    'HEALTH_SCIENCE_NURSING',
                    'HISTORY',
                    'PSYCHOLOGY_EDUCATION',
                    'ART_MUSIC_FILM_STUDIES',
                    'SOCIAL_POLITICAL_SCIENCE',
                    'SOCIOLOGY',
                    'PHILOSOPHY',
                    'MARKETING',
                    'RELIGIOUS_STUDIES',
                    'ECONOMICS',
                    'COMPUTER_SCIENCE_TECHNOLOGY',
                    'OTHER'
                  ]),
                qualityLevel: faker.helpers.arrayElement(['HIGH_SCHOOL','COLLEGE','UNIVERSITY','MASTERS', 'PHD']),
                format: faker.helpers.arrayElement(['APA', 'MLA', 'CHICAGO']),
                sources: faker.number.int({ min: 1, max: 20 }),
                clientId: faker.number.int({ min: 1, max: 5}),
                createdAt: faker.date.past(),
                updatedAt: faker.date.recent(),
            }
        })
        console.log('Assignment created:', client)
        if(nums <= 0) break
    }
}


// async function WriterFaker(nums) {
//     for(let i = 0; i < nums; i++){
//         const admin = await prisma.admin.findFirst(); // Assuming you have at least one admin in the database

//         if (!admin) {
//             console.error('No admin found. Please create an admin first.');
//             break;
//         }

//         const writer = await prisma.writer.create({
//             data: {
//                 name: faker.person.fullName(),
//                 email: faker.internet.email(),
//                 password: faker.internet.password(),
//                 adminId: 1, 
//                 createdAt: faker.date.past(),
//                 updatedAt: faker.date.recent(),
//             }
//         })
//         console.log('Writer created:', writer)
//         if(nums <= 0) break
//     }
// }

// async function DelegationFaker(nums) {
//     for(let i = 0; i < nums; i++){
//         const assignment = await prisma.assignment.findFirst();
//         const writer = await prisma.writer.findFirst();
//         const admin = await prisma.admin.findFirst(); 

//         if (!assignment || !writer || !admin) {
//             console.error('No assignment, writer, or admin found. Please create them first.');
//             break;
//         }

//         const delegation = await prisma.delegation.create({
//             data: {
//                 assignmentId: faker.number.int({ min: 1, max: 7 }), 
//                 writerId: faker.number.int({ min: 1, max: 10 }), 
//                 adminId: 1, 
//                 delegationDate: faker.date.past(),
//                 status: faker.lorem.word(),
//                 remarks: faker.lorem.sentence(),
//                 submissionDate: faker.date.future(),
//                 reviewDate: faker.date.future(),
//             }
//         })
//         console.log('Delegation created:', delegation)
//         if(nums <= 0) break
//     }
// }



const clients = 7


AssignmentFaker(clients)
    .catch((error) => {
            console.error('Error generating fake data:', error);
        })
    .finally(async () => {
            await prisma.$disconnect();
        });


