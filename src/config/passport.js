const passport = require('passport');
const { Strategy: JwtStrategy } = require('passport-jwt');
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Cookie extractor for user token
const userCookieExtractor = function (req) {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies['token']; // Extract user token
	}
	return token;
};

// Cookie extractor for admin token
const adminCookieExtractor = function (req) {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies['adminToken']; // Extract admin token
	}
	return token;
};

const writerCookieExtractor = function (req) {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies['writerToken']; // Extract admin token
	}
	return token;
};

// JWT strategy options for users
const userOpts = {
	jwtFromRequest: userCookieExtractor,
	secretOrKey: jwtSecret,
};

// JWT strategy options for admins
const adminOpts = {
	jwtFromRequest: adminCookieExtractor,
	secretOrKey: jwtSecret,
};

const writerOpts = {
	jwtFromRequest: writerCookieExtractor,
	secretOrKey: jwtSecret,
};

// JWT strategy for users
passport.use(
	'user-jwt',
	new JwtStrategy(userOpts, async (jwt_payload, done) => {
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
			return done(error, false);
		}
	})
);

// JWT strategy for admins
passport.use(
	'admin-jwt',
	new JwtStrategy(adminOpts, async (jwt_payload, done) => {
		try {
			const admin = await prisma.admin.findUnique({
				where: { id: jwt_payload.id },
			});
			if (admin) {
				return done(null, admin);
			} else {
				return done(null, false);
			}
		} catch (error) {
			return done(error, false);
		}
	})
);

passport.use(
	'writer-jwt',
	new JwtStrategy(writerOpts, async (jwt_payload, done) => {
		try {
			const writer = await prisma.writer.findUnique({
				where: { id: jwt_payload.id },
			});
			if (writer) {
				return done(null, writer);
			} else {
				return done(null, false);
			}
		} catch (error) {
			return done(error, false);
		}
	})
);

// Ensure Prisma disconnection on process termination
process.on('SIGINT', async () => {
	await prisma.$disconnect();
	process.exit(0);
});

module.exports = passport;
