// import { MailtrapClient } from "mailtrap";
// import dotenv from "dotenv";

// dotenv.config();
// console.log("MAILTRAP_TOKEN:", process.env.MAILTRAP_TOKEN);

// export const mailtrapClient = new MailtrapClient({
//   token: process.env.MAILTRAP_TOKEN,
// });

// export const sender = {
//   email: "hello@demomailtrap.co",
//   name: "Mailtrap Test"
// };

import { MailtrapClient } from "mailtrap";
import dotEnv from "dotenv";
// const TOKEN = "b62d8c6665d65e53b4a8c42ac38cc830";

dotEnv.config();
export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
  endpoint: process.env.MAILTRAP_ENDPOINT
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test"
};

