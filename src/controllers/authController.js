require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const { send } = require('process');

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASSWORD;

const prisma = new PrismaClient();
// Function to send a welcome email
// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
	service: 'gmail', // You can use other services like Outlook, Yahoo, etc.
	auth: {
		user: SMTP_USER, // Your email address
		pass: SMTP_PASS, // Your email password or App Password
	},
});

async function SendWelcomeEmail(userEmail, Username) {
	const message = {
		from: SMTP_USER, // Sender email address
		to: userEmail, // Recipient email address (user who signed up)
		subject: 'Welcome to Our Platform!', // Subject line
		text: `Hi ${Username},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team`,
		html: `
              <h1>Welcome to Our Platform, ${Username}!</h1>
              <p>We're excited to have you on board.</p>
              <p>Feel free to explore and let us know if you need any help.</p>
              <br/>
              <p>Best regards,<br/>The Team</p>
            `,
	};

	try {
		// Send the email using the transporter
		let info = await transporter.sendMail(message);
		console.log('Email sent: ', info.response);
	} catch (error) {
		console.error('Error sending email: ', error);
	}
}

async function SendResetPasswordEmail(userEmail, resetLink) {
	const message = {
		from: SMTP_USER,
		to: userEmail,
		subject: 'Password Reset Request',
		text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
		html: `<p>You requested a password reset. Click the link to reset your password: <a href="${resetLink}">Reset Password</a></p>`,
	};

	try {
		await transporter.sendMail(message);
		console.log('Reset password email sent');
	} catch (error) {
		console.error('Error sending email: ', error);
	}
}

async function newClient(req, res, next) {
	const error = validationResult(req);

	if (!error.isEmpty()) {
		return res.status(400).json({ errors: error.array() });
	}

	const { fullNames, username, email, password, tel } = req.body;

	try {
		const userExists = await prisma.client.findUnique({
			where: { email },
		});

		if (userExists) {
			return res.status(400).json({ message: 'User already exists' });
		}
		console.log('Past user existence check');

		const hashedPassword = await bcrypt.hash(password, 10);

		const client = await prisma.client.create({
			data: {
				fullNames,
				username,
				email,
				password: hashedPassword,
				tel,
			},
		});
		console.log('Past user creation');

		// Send welcome email
		SendWelcomeEmail(email, username);

		res.status(201).json({
			message: 'Client created successfully',
			client,
			clientsAssgn: {},
		});
	} catch (err) {
		res.status(500).json({ message: 'Internal server error' });
	}
}

async function resetPassword(req, res) {
	const { token } = req.params; // Extract token from URL parameters
	const { newPassword } = req.body; // Extract new password from request body

	if (!token) {
		return res.status(400).json({ message: 'Token must be provided' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
		const client = await prisma.client.findUnique({
			where: { email: decoded.email },
		});

		if (
			!client ||
			client.resetPasswordToken !== token ||
			client.resetPasswordExpires < new Date()
		) {
			return res
				.status(400)
				.json({ message: 'Invalid or expired token' });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await prisma.client.update({
			where: { email: decoded.email },
			data: {
				password: hashedPassword,
				resetPasswordToken: null,
				resetPasswordExpires: null,
			},
		});

		res.status(200).json({
			message: 'Password has been reset successfully',
		});
	} catch (err) {
		return res.status(500).json({ message: 'Internal server error' });
	}
}

async function requestResetPassword(req, res) {
	const { email } = req.body;

	const client = await prisma.client.findUnique({ where: { email } });
	if (!client) {
		return res.status(404).json({ message: 'User not found' });
	}

	const token = jwt.sign({ email: client.email }, process.env.JWT_SECRET, {
		expiresIn: '1h',
	});
	console.log(token);
	const resetLink = `http://localhost:3000/auth/reset-password/{token}`;

	await prisma.client.update({
		where: { email: client.email },
		data: {
			resetPasswordToken: token,
			resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour from now
		},
	});

	SendResetPasswordEmail(email, resetLink);

	res.status(200).json({ message: 'Reset link sent to your email' });
}

async function login(req, res) {
	const { email, password } = req.body;
	const client = await prisma.client.findUnique({ where: { email } });

	if (!client) {
		return res.status(401).json({ message: 'Invalid credentials' });
	}

	const isValidPassword = await bcrypt.compare(password, client.password);
	if (!isValidPassword) {
		return res.status(401).json({ message: 'Invalid credentials' });
	}

	const accessToken = jwt.sign(
		{ id: client.id, email: client.email },
		process.env.JWT_SECRET,
		{ expiresIn: '1h' }
	);

	const refreshToken = jwt.sign(
		{ id: client.id, email: client.email },
		process.env.JWT_SECRET,
		{ expiresIn: '7d' }
	);

	res.cookie('token', accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 3600000,
	});

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 604800000,
	});

	res.json({
		message: 'Login successful',
		client: { id: client.id, email: client.email },
	});
}

const logOut = (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 0,
	});
	res.clearCookie('refreshToken');
	res.status(200).json({ message: 'Logged out successfully' });
};

const checkAuth = (req, res) => {
	const token = req.cookies.token;

	// console.log('Token availablity(checkAuth):', token);

	if (!token) {
		return res
			.status(401)
			.json({ authenticated: false, message: 'Access denied' });
	}

	try {
		jwt.verify(token, process.env.JWT_SECRET);
		return res
			.status(200)
			.json({ authenticated: true, message: 'Access granted' });
	} catch (err) {
		res.status(401).json({ message: 'Access denied', error: err.message });
	}
};

module.exports = {
	newClient,
	resetPassword,
	requestResetPassword, // For client
	login,
	checkAuth,
	logOut,
};
