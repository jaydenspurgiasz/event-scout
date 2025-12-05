import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/eventModel.js', () => ({
  getUpcomingEventsWithParticipants: jest.fn(),
}));

jest.unstable_mockModule('../services/emailService.js', () => ({
  sendEventReminder: jest.fn(),
}));

const { getUpcomingEventsWithParticipants } = await import('../models/eventModel.js');
const { sendEventReminder } = await import('../services/emailService.js');
const { sendReminders } = await import('../services/reminderJob.js');

describe('Reminder Job', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sends reminders to all participants with upcoming events', async () => {
    const mockParticipants = [
      { email: 'user1@test.com', title: 'Beach Party', date: '2025-12-06', location: 'Beach' },
      { email: 'user2@test.com', title: 'Concert', date: '2025-12-06', location: 'Arena' },
    ];
    getUpcomingEventsWithParticipants.mockResolvedValue(mockParticipants);
    sendEventReminder.mockResolvedValue();

    await sendReminders();

    expect(getUpcomingEventsWithParticipants).toHaveBeenCalled();
    expect(sendEventReminder).toHaveBeenCalledTimes(2);
    expect(sendEventReminder).toHaveBeenCalledWith('user1@test.com', mockParticipants[0]);
    expect(sendEventReminder).toHaveBeenCalledWith('user2@test.com', mockParticipants[1]);
  });

  test('handles no upcoming events', async () => {
    getUpcomingEventsWithParticipants.mockResolvedValue([]);
    
    await sendReminders();

    expect(getUpcomingEventsWithParticipants).toHaveBeenCalled();
    expect(sendEventReminder).not.toHaveBeenCalled();
  });

  test('handles database error', async () => {
    getUpcomingEventsWithParticipants.mockRejectedValue(new Error('DB Error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await sendReminders();

    expect(consoleSpy).toHaveBeenCalledWith('reminder error', 'DB Error');
    consoleSpy.mockRestore();
  });
});
