const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function allClient(req, res, next) {
    try {
        const clients = await prisma.client.findMany();
        res.json({
            status: 200,
            message: "Successfully retrieved clients",
            total: clients.length,
            clients: clients
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Invalid request"
        });
    }
}

module.exports = {
    allClient
}



