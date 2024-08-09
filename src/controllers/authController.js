// src/controllers/authController.js
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function registerClient(req, res) {
    const { fullNames, username, email, password, tel } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await prisma.client.create({
        data: {
            fullNames,
            username,
            email,
            password: hashedPassword,
            tel,
        },
    });
    console.log('success')

    res.json(client);
}

async function registerWriter(req, res) {
    const { name, email } = req.body;
    const client = await prisma.writer.create({
        data: {
            name,
            email
        },
    });
    console.log('success')

    res.json(client);
}


async function login(req, res) {
    const { email, password } = req.body;
    const client = await prisma.client.findUnique({ where: { email } });

    if (!client) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, client.password);
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Here you can create a session or JWT token
    res.json({ message: 'Login successful', client });
}

module.exports = { registerClient,registerWriter, login };