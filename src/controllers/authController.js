require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const sgMail = require('@sendgrid/mail');



sgMail.setApiKey(process.env.SENDGRID_API_KEY);


console.log("sendgridKey: ",process.env.SENDGRID_API_KEY)

const prisma = new PrismaClient();


async function newClient(req, res, next) {

    const error = validationResult(req)
    
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
 
    const { fullNames, username, email, password, tel} = req.body
 
    try{
        
         const userExists = await prisma.client.findUnique({
             where: {email}
         })
 
         if(userExists) {
             return res.status(400).json({ message: 'User already exists' });
         }
         console.log('Past user existence check')

         const hashedPassword = await bcrypt.hash(password, 10);
 
         const client = await prisma.client.create({
             data: {
                 fullNames,
                 username,
                 email,
                 password: hashedPassword,
                 tel
             },
         })

         // Send welcome email
         await sendWelcomeEmail(client.email, client.fullNames);
        
         // Send email verification
         await sendVerificationEmail(client.email);

         res.status(201).json({
             message: "Client created successfully",
             client
         });
 
    }
    catch(err) {
     res.status(500).json({ message: 'Internal server error' });
    }
 }

// Function to send a welcome email
async function sendWelcomeEmail(email, fullNames) {
    const msg = {
        to: email, 
        from: 'binamin.h.hassan14@gmail.com', 
        subject: 'Welcome to Our Service!',
        text: `Hello ${fullNames}, welcome to our service!`,
        html: `<strong>Hello ${fullNames}, welcome to our service!</strong>`,
    };

    try {
        const response = await sgMail.send(msg);
        console.log(response[0].statusCode);
        console.log(response[0].headers);
    } catch (error) {
        console.error('Error sending welcome email:', {
            message: error.message,
            stack: error.stack,
            email, 
            fullNames 
        });    }
}

async function sendVerificationEmail(email) {
    const msg = {
        to: email, 
        from: 'binamin.h.hassan14@gmail.com',
        subject: 'Email Verification',
        text: 'Please verify your email address.',
        html: '<strong>Please verify your email address.</strong>',
    };

    try {
        const response = await sgMail.send(msg);
        console.log(response[0].statusCode);
        console.log(response[0].headers);
    } catch (error) {
        console.error(error);
    }
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
    const token = jwt.sign(
        { id: client.id, email: client.email },      
        process.env.JWT_SECRET,                  
        { expiresIn: '1h' }                      
      );
    res.json({ 
        message: 'Login successful',
        token:  token,
        client: {id: client.id, email: client.email}
     });
}

module.exports = { 
    newClient,
    login
 };