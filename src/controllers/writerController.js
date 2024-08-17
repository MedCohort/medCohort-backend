const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { write } = require('fs');


const prisma = new PrismaClient();


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

   const { name, email} = req.body

   try{
        // Check if user already exists - TO BE REDONE AFTER SCHEMA UPDATE
        const userExists = await prisma.writer.findUnique({
            where: {email}
        })

        if(userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        console.log('Past user existence check')
        // const hashedPassword = await bcrypt.hash(password, 10);

        const writer = await prisma.writer.create({
            data: {
                name,
                email,
                adminId:1
            },
        })
        console.log('Writer created')

        res.status(201).json({
            message: "Writer created successfully",
            writer
        });

   }
   catch(err) {
    res.status(500).json({ message: 'Internal server error' });
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


module.exports = {
    allWriters,
    newWriter,
    getWriterById,
    updateWriter,
    deleteWriter
}

