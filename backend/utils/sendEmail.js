import nodemailer from "nodemailer";

/*
=============================
TRANSPORTER
=============================
*/
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === "true" : true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/*
=============================
VERIFY (ONLY FOR DEBUG)
=============================
*/
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ EMAIL ERROR:", error.message);
  } else {
    console.log("✅ Email server ready");
  }
});

/*
=============================
SEND EMAIL FUNCTION
=============================
*/
const sendEmail = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: `"Library App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("📩 Email sent to:", to);
  } catch (error) {
    console.log("❌ SEND EMAIL ERROR:", error.message);
  }
};

export default sendEmail;