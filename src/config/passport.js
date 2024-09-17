const passport = require('passport');
const { Strategy: JwtStrategy } = require('passport-jwt');
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token']; 
    // console.log("Extracted token: ", token);
  }
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor, 
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await prisma.client.findUnique({
        where: { id: jwt_payload.id },
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false); 
      }
    } catch (error) {
      console.error('Error in JWT strategy:', error); 
      return done(error, false); 
    }
  })
);

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = passport;
