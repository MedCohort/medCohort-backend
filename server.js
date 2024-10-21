const { PrismaClient } = require('@prisma/client');
const express = require('express');
const prisma = new PrismaClient();


// const app = express();
const appOne = require('./app')



// ...Other middleware and route configurations...

// Start the server
const PORT = process.env.PORT || 3000;

appOne.listen(PORT, async () => {
  try {
    await prisma.$connect();

    console.log(`Server running on port ${PORT}`);

  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
});

appOne.get('/',(req,res)=>{
  console.log("Test: it works")
  res.send("Hello: DONE")
})  


// Graceful shutdown on process termination
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  await prisma.$connect();

  process.exit(0);
  
});