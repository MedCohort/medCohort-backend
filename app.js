const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const appOne = express();
const authRoutes = require('./src/routes/authRoutes')
const clientRoutes = require('./src/routes/clientsRoutes')
const adminRoutes = require('./src/routes/adminRoutes')

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
appOne.use('/api/client', clientRoutes)
appOne.use('/api/admin', adminRoutes)


appOne.get('/',(req,res)=>{
    console.log(process.env.DATABASE_URL)
    res.send("Hello: DONE")
  })  

module.exports = appOne;

// 