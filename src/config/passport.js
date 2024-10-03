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
	  console.log("JWT Payload:", jwt_payload); // Log the payload
  
	  let user;
	  if (jwt_payload.role === 'client') {
		console.log("Looking up client...");
		user = await prisma.client.findUnique({
		  where: { id: jwt_payload.id },
		});
	  } else if (jwt_payload.role === 'admin') {
		console.log("Looking up admin...");
		user = await prisma.admin.findUnique({
		  where: { id: jwt_payload.id },
		});
	  }
  
	  if (user) {
		console.log("User found:", user);
		return done(null, user);
	  } else {
		console.log("User not found");
		return done(null, false);
	  }
	})
  );
  
   

process.on('SIGINT', async () => {
	await prisma.$disconnect();
	process.exit(0);
});

module.exports = passport;
