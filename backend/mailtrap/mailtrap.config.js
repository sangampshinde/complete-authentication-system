import dotenv from "dotenv";
dotenv.config();
import { MailtrapClient } from "mailtrap";




const TOKEN = process.env.MAILTRAP_TOKEN;

const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

// console.log("TOKEN",TOKEN)


export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});



export const sender = {
  email: "hello@demomailtrap.co",
  name: "Sangam Shinde",
};


// const recipients = [
//   {
//     email: "try.sangam@gmail.com",
//   }
// ];



// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);


  