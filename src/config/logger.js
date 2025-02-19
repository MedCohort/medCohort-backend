const path = require('path');
const { createLogger, format, transports } = require('winston');

const logDirectory = path.join(__dirname, '../../logs'); 
console.log(`Logging to: ${logDirectory}`); 

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDirectory, 'combined.log') })
  ]
});

module.exports = logger;
