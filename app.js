const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passportConfig = require('./src/config/passport');
const appOne = express();
const authRoutes = require('./src/routes/authRoutes')
const clientRoutes = require('./src/routes/clientsRoutes')
const adminRoutes = require('./src/routes/adminRoutes')
const writerRoutes = require('./src/routes/writerRoutes')
const assignmentRoutes = require('./src/routes/assignmentsRoutes')

// Middleware
appOne.use(cookieParser());
appOne.use(bodyParser.json());
appOne.use(compression());

appOne.use(passportConfig.initialize());
 
appOne.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true,
}));

// Routes
appOne.use('/auth', authRoutes)
appOne.use('/api/client', clientRoutes)
appOne.use('/api/admin', adminRoutes)
appOne.use('/api/writer', writerRoutes)
appOne.use('/api/assignments', assignmentRoutes)



appOne.get('/',(req,res)=>{
    console.log(process.env.DATABASE_URL)
    res.send("Hello: DONE")
  })  

module.exports = appOne;

// 