const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require("./src/config/logger")
const passportConfig = require('./src/config/passport');
const appOne = express();
const authRoutes = require('./src/routes/authRoutes')
const clientRoutes = require('./src/routes/clientsRoutes')
const adminRoutes = require('./src/routes/adminRoutes')
const writerRoutes = require('./src/routes/writerRoutes')
const assignmentRoutes = require('./src/routes/assignmentsRoutes')
const { swaggerUi, swaggerDocs } = require('./src/config/swagger');
const { register, metricsMiddleware} = require('./src/config/metrics'); 


// Middleware
appOne.use(cookieParser());
appOne.use(bodyParser.json());
appOne.use(compression());

// logging 
appOne.use(morgan("combined", {stream:{write: message => logger.info(message.trim())}}))

logger.info('Test log message to verify Winston setup');
logger.error('Test error message to verify Winston setup');

appOne.use(passportConfig.initialize());

const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

 
appOne.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true,
  
}));

// Metrics middleware
appOne.use(metricsMiddleware);

// prometheus metrics route
appOne.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Swagger documentation route

// Routes
appOne.use('/auth', authRoutes)
appOne.use('/api/client', clientRoutes)
appOne.use('/api/admin', adminRoutes)
appOne.use('/api/writer', writerRoutes)
appOne.use('/api/assignments', assignmentRoutes)

appOne.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


appOne.get('/',(req,res)=>{
    console.log(process.env.DATABASE_URL)
    res.send("Hello: DONE")
  })  

module.exports = appOne;

// 