const {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	WelcomeEmail,
} = require("./template-email.js");
const { mailtrapClient, sender } = require("./mailtrap.js")
const { MailtrapClient, MailtrapTransport } = require("mailtrap");
const Nodemailer = require("nodemailer");
require("dotenv").config();
// dotenv.config();
// const nodemailer =('nodemailer')
const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];
	try {
		const TOKEN = "f955ab28c6451eb05953d99cda4bf3b0";
		const SENDER_EMAIL = "nischalmehta37@gmail.com";
		const RECIPIENT_EMAIL = "nischalmehta37@gmail.com";


		const transporter = nodemailer.createTransport({
			host: "smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "1c192b628c318a",
				pass: "0d056ab7b0a821"
			}
		});

		const mailOptions = {
			from: sender,
			to: RECIPIENT_EMAIL,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification",
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error("Error sending email:", error);
			} else {
				console.log("Email sent:", info.response);
			}
		});

		// client
		//   .send({
		//     from: sender,
		//     to: [{ email: RECIPIENT_EMAIL }],
		//     subject: "Hello from Mailtrap!",
		//     text: "Welcome to Mailtrap Sending!",
		//   })
		//   .then(console.log)
		//   .catch(console.error);
		// const response = await mailtrapClient.send({
		//     from: sender,
		//     to: recipient,
		//     subject: "Verify your email",
		//     html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
		//     category: "Email Verification",
		// });

		// console.log("Email sent successfully", response);
	} catch (error) {
		console.log(error)
		console.error("Error sending verification email:", error.response?.data || error.message);
	}
};


const sendWelcomeEmail = async (email, name) => {
	const recipient = [{ email }];
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "1c192b628c318a",
				pass: "0d056ab7b0a821"
			}
		});
		const info = await transporter.sendMail({

			from: sender.email,
			to: recipient[0].email,
			subject: "Welcome",
			html: WelcomeEmail.replace("{user_name}", name),
			category: "Welcome Mail",

		});

		console.log("Email sent: " + info.messageId);
	}

	catch (error) {
		console.error(`Error sending welcome email`, error);

		throw new Error(`Error sending welcome email: ${error}`);
	}
};

const sendPasswordResetEmail = async (email, resetURL) => {

	const recipient = [{ email }];
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "1c192b628c318a",
				pass: "0d056ab7b0a821"
			}
		});
		const info = await transporter.sendMail({

			from: sender.email,
			to: recipient[0].email,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",

		});

		console.log("Email sent: " + info.messageId);
		

	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "1c192b628c318a",
				pass: "0d056ab7b0a821"
			}
		});
		const info = await transporter.sendMail({

			from: sender.email,
			to: recipient[0].email,
			subject: "Password Reset Successfully",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",

		});

		console.log("Email sent: " + info.messageId);
		
		

	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendResetSuccessEmail, sendWelcomeEmail }