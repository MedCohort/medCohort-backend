const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { write } = require('fs');
const { send } = require('process');
const nodemailer = require('nodemailer');




const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASSWORD

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: SMTP_USER, 
      pass: SMTP_PASS, 
    },
  });


async function SendWelcomeEmailAndSetPassword(userEmail, Username, passwordResetLink){
    const message = {
        from: SMTP_USER, 
        to: userEmail, 
        subject: 'Welcome to Our Platform!', 
        text: `Hi ${Username},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team`,
        html: `
          <h1>Welcome to Our Platform, ${Username}!</h1>
          <p>We're excited to have you on board.</p>
          <p>Your current default password is defaultPassword123</p>
          <p>You requested a password reset. Click the link to reset your password: ${passwordResetLink}</p>
          <p>Feel free to explore and let us know if you need any help.</p>
          <br/>
          <p>Best regards,<br/>The Team</p>
        `,
      };
    
      try{
        let info = await transporter.sendMail(message);
        console.log('Email sent: ', info.response);
      }
      catch(error){
        console.error('Error sending email: ', error) 
        
      }
}

async function allWriters(req, res, next) {
    console.log('Past findMany')

    try {
        const writers = await prisma.writer.findMany();
        console.log('Found %d writers', writers.length);
        res.json({
            status: 200,
            message: "Successfully retrieved Writers list",
            total: writers.length,
            admins: writers 
        });
    } catch (err) {
        console.log(err);
        console.log('test');
        res.status(500).json({
            message: "Internal server error", // More appropriate error message
            error: err.message // Optional: include error message for debugging
        });
    }
}


async function newWriter(req,res,next) {
   // Validate request data
   const error = validationResult(req)
   
   if (!error.isEmpty()) {
     return res.status(400).json({ errors: error.array() });
   }

   const { name, email,adminId } = req.body

   try {

        const admin = await prisma.admin.findUnique({ where: { id: adminId } });
        if (!admin) {
            return res.status(400).json({ message: 'Admin not found. Please create an admin before adding a writer.' });
        }


        const userExists = await prisma.writer.findUnique({
            where: { email }
        })

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        console.log('Past user existence check')


        const defaultPassword = 'defaultPassword123'; 
        const hashedPassword = await bcrypt.hash(defaultPassword, 10); 

        const writer = await prisma.writer.create({
            data: {
                name,
                email,
                password: hashedPassword, 
                adminId: admin.id
            },
        })
        console.log('Writer created')

        const writerToken  = jwt.sign(
            {email: writer.email},
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        )
        
        console.log(writerToken);

        const welcomelink = `http://localhost:3000/api/writer/resetpassword/{writerToken}`

        await prisma.writer.update({
            where: { email: writer.email },
            data: {
                resetPasswordToken: writerToken,
                resetPasswordExpires: new Date(Date.now() + 3600000), 
            },
        });

        SendWelcomeEmailAndSetPassword(writer.email,writer.name, welcomelink)


        res.status(201).json({
            message: "Writer created successfully",
            writer
        });

   } catch (err) {
       res.status(500).json({ message: 'Internal server error' });
   }
}


async function passSetUp(req, res, next){
    const {writerToken} = req.params
    const { password } = req.body;
    const {defaultPassword} = req.body

    if (!writerToken) {
        return res.status(400).json({ message: 'Token must be provided' });
    }

    try {
        const decoded = jwt.verify(writerToken, process.env.JWT_SECRET)

        const writer = await prisma.writer.findUnique(
            {
                where: { email: decoded.email }
            }
        )

        if (!writer) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const isValidPassword = await bcrypt.compare(defaultPassword, writer.password)

        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        if (writer.resetPasswordToken!== writerToken || writer.resetPasswordExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPass = await bcrypt.hash(password, 10)

        await prisma.writer.update({
            where: { id: writer.id },
            data: { password: hashedPass, resetPasswordToken: null, resetPasswordExpires: null },
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });

    }

    
}

async function getWriterById(req,res,next) {
    try {
        const writer = await prisma.writer.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if(!writer) {
            return res.status(404).json({ message: 'Writer not found' });
        }
        res.json({
            status: 200,
            message: "Writer retrieved successfully",
            writer
        });
    } catch (error) {
         console.log(error);
         res.status(500).json({ message: 'Internal server error' });
    }
}


async function updateWriter(req, res, next) {
    console.log('Func entry')
    const {id} = req.params;
    const {name, email} = req.body

    try {
    const user = await prisma.writer.findUnique({
        where: { id: parseInt(id, 10) },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('Writer check successful')

    //   let hashedPassword = user.password;
    //   if (password) {
    //     const bcrypt = require('bcryptjs');
    //     hashedPassword = await bcrypt.hash(password, 10);
    //   }

      const updatedCli = await prisma.writer.update({
        where: { id: parseInt(id, 10) },
        data: {
          name: name || user.username,
          email: email || user.email,
        },
      })

      res.status(200).json({
        id: updatedCli.id,
        email: updatedCli.email,
        name: updatedCli.name,
        createdAt: updatedCli.createdAt,
        updatedAt: updatedCli.updatedAt,
      });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function deleteWriter(req,res,next){
    const {id} = req.params;

    try {
        const client = await prisma.writer.findUnique({
            where: {id: parseInt(id,10)},
        })

        if(!client) {
            return res.status(404).json({ message: 'Writer not found' });
        }

        await prisma.writer.delete({
            where: { id: parseInt(id, 10) },
        })

        res.status(204).json({ message: 'Writer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

async function writerLogin(req, res, next){
    const { email, password } = req.body;

    try {
        const writer = await prisma.writer.findUnique({
            where: { email },
        });

        if (!writer) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, writer.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const writerToken  = jwt.sign(
            {id: writer.id},
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        )

        res.cookie('writerToken', writerToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
			maxAge: 36000000,
        })

        res.json({
            status: 200,
            message: "Writer logged in successfully",
            writerToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).json()
    }
}

5

module.exports = {
    allWriters,
    newWriter,
    getWriterById,
    updateWriter,
    deleteWriter,
    passSetUp,
    writerLogin
}

