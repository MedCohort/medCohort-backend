const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const appOne = express();

// Middleware
appOne.use(bodyParser.json());
appOne.use(compression());
appOne.use(cors());

// Routes
appOne.use('/auth', authRoutes)

appOne.get('/',(req,res)=>{
    console.log(process.env.DATABASE_URL)
    res.send("Hello: DONE")
  })  

module.exports = appOne;

// 