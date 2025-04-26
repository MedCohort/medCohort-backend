const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

// Ensure the logs directory exists
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
  console.log(`🚨 Logs directory not found! Creating: ${logDirectory}`);
} else {
  console.log(`✅ Logs directory exists: ${logDirectory}`);
}

// Create Winston logger
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

// Debugging logs
console.log("✅ Winston logger initialized!");
logger.info("✅ Test log: Winston is working");
logger.error("🚨 Test error: Should be in error.log");

module.exports = logger;
