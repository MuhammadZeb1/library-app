import nodemailer from "nodemailer";

/*
=============================
TRANSPORTER
=============================
*/
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // 👈 IMPORTANT (SSL)
  auth: {
    user: "atieeq82@gmail.com",
    pass: "bmbfbdkpqfdcbchg",
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
      from: `"Library App" <atieeq82@gmail.com>`,
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