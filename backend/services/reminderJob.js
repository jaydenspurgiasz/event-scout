import cron from "node-cron";
import { getUpcomingEventsWithParticipants } from "../models/eventModel.js";
import { sendEventReminder } from "./emailService.js";

export const sendReminders = async () => {
  try {
    const rows = await getUpcomingEventsWithParticipants();
    for (const row of rows) {
      await sendEventReminder(row.email, row);
      console.log(`reminder sent to ${row.email} for ${row.title}`);
    }
  } catch (err) {
    console.error("reminder error", err.message);
  }
};

export const startReminderJob = () => {
  cron.schedule("0 9 * * *", sendReminders);
  console.log("Event reminder job scheduled");
};
