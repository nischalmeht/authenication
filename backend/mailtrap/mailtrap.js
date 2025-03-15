const { MailtrapClient } = require("mailtrap");
const dotenv =require("dotenv");

dotenv.config();
console.log("MAILTRAP_TOKEN:", process.env.MAILTRAP_TOKEN ? "Loaded ✅" : "Not Found ❌");
 const mailtrapClient = new MailtrapClient({
	endpoint: process.env.MAILTRAP_ENDPOINT,
	token: process.env.MAILTRAP_TOKEN,
});

 const sender = {
	email: "nischalmehta37@gmail.com",
	name: "Nischal Mehta",
};

module.exports={sender,mailtrapClient}


// Looking to send emails in production? Check out our Email API/SMTP product!
// const { MailtrapClient } = require("mailtrap");

// const TOKEN = "f955ab28c6451eb05953d99cda4bf3b0";

// const client = new MailtrapClient({
//   token: TOKEN,
//   testInboxId: 3464765,
// });

// const sender = {
//   email: "hello@example.com",
//   name: "Mailtrap Test",
// };
// const recipients = [
//   {
//     email: "nischalmehta37@gmail.com",
//   }
// ];

// client.testing
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);