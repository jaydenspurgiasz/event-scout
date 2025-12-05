import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

export const sendEventReminder = async (userEmail, event) => {
  const eventDate = new Date(event.date).toLocaleString();
  
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: `Reminder: ${event.title} is coming up!`,
    html: `
      <h2>Event Reminder</h2>
      <p>Don't forget about <strong>${event.title}</strong>!</p>
      <p><strong>When:</strong> ${eventDate}</p>
      ${event.location ? `<p><strong>Where:</strong> ${event.location}</p>` : ""}
      ${event.description ? `<p>${event.description}</p>` : ""}
    `,
  });
};
