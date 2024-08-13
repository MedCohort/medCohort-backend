const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const appOne = express();
const authRoutes = require('./src/routes/authRoutes')
const clientRoutes = require('./src/routes/clientsRoutes')
// Middleware
appOne.use(bodyParser.json());
appOne.use(compression());
appOne.use(cors({
  origin: 'http://localhost:3000/', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

// Routes
appOne.use('/auth', authRoutes)
appOne.use('/api', clientRoutes)


appOne.get('/',(req,res)=>{
    console.log(process.env.DATABASE_URL)
    res.send("Hello: DONE")
  })  

module.exports = appOne;

// 