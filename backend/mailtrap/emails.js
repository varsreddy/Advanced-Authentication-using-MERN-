import { mailtrapClient, sender } from "./mailtrap.config.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  console.log(email);
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email: email }],
      subject: "Verify your email",
      // html: VERIFICATION_EMAIL_TEMPLATE.replace(
      //   "{verificationCode}",
      //   verificationToken
      // ),
      text: `Verification code: ${verificationToken}`,
      category: "Email verification"
    });

    // console.log("Verification email sent successfully", response);
    console.log("Verification email sent successfully");
  } catch (err) {
    console.error(`Error sending verification email: ${err.message}`);
    throw new Error(`Error sending verification email: ${err.message}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  console.log(resetURL);
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Password",
      // html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(/{resetURL}/g, resetURL),
      text: `Copy this url and paste in browser: ${resetURL}`,
      category: "Password Reset"
    });

    console.log("Password reset email sent successfully", response);
  } catch (err) {
    console.error(`Error sending password reset email: ${err.message}`);
    throw new Error(`Error sending password reset email: ${err.message}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password reset"
    });

    console.log("Password reset success email sent successfully", response);
  } catch (err) {
    console.error(`Error sending password reset success email: ${err.message}`);
    throw new Error(
      `Error sending password reset success email: ${err.message}`
    );
  }
};
