// testConnection.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const clients = await prisma.client.findMany();
    console.log(clients);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });