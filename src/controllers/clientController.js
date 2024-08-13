const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


const prisma = new PrismaClient();


async function allClient(req, res, next) {
    console.log('Past findMany')

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

async function newClient(req,res,next) {
   // Validate request data
   const error = validationResult(req)
   
   if (!error.isEmpty()) {
     return res.status(400).json({ errors: error.array() });
   }

   const { fullNames, username, email, password, tel} = req.body

   try{
            // Check if user already exists - TO BE REDONE AFTER SCHEMA UPDATE
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

        res.status(201).json({
            message: "Client created successfully",
            client
        });

   }
   catch(err) {
    res.status(500).json({ message: 'Internal server error' });
   }
}


async function getClientById(req,res,next) {
    try {
        const client = await prisma.client.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if(!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({
            status: 200,
            message: "Client retrieved successfully",
            client
        });
    } catch (error) {
         console.log(error);
         res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateClient(req, res, next) {
    console.log('Func entry')
    const {id} = req.params;
    const {fullNames,username, email, password, tel} = req.body

    try {
    const user = await prisma.client.findUnique({
        where: { id: parseInt(id, 10) },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('Client check successful')

      let hashedPassword = user.password;
      if (password) {
        const bcrypt = require('bcryptjs');
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updatedCli = await prisma.client.update({
        where: { id: parseInt(id, 10) },
        data: {
          fullNames: fullNames || client.fullNames,
          username: username || client.username,
          email: email || client.email,
          password: hashedPassword,
          tel: tel || client.tel
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

async function deleteClient(req,res,next){
    const {id} = req.params;

    try {
        const client = await prisma.client.findUnique({
            where: {id: parseInt(id,10)},
        })

        if(!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        await prisma.client.delete({
            where: { id: parseInt(id, 10) },
        })

        res.status(204).json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

module.exports = {
    allClient,
    newClient,
    getClientById,
    updateClient,
    deleteClient
}



