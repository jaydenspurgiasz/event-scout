import { test, expect } from '@playwright/test';

test('User and Event Creation / Test', async ({ page }) => {
  const testUser = {
    name: 'Test User',
    email: `testuser123@example.com`,
    password: 'Password123'
  };

  await page.goto('http://localhost:3000');

  // Navigate to registration page
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page).toHaveURL('http://localhost:3000/register');

  // Fill out registration form and submit
  await page.fill('#name', testUser.name);
  await page.fill('#login-email', testUser.email);
  await page.fill('#login-password', testUser.password);
  await page.getByRole('button', { name: 'Sign Up' }).click();

  // Verify redirect to home page after registration
  await expect(page).toHaveURL('http://localhost:3000/home');

  // Click button to create a new event
  await page.getByRole('button', { name: 'Create Event' }).click();

  const eventData = {
    title: `Test Event`,
    description: 'This is a test event',
    date: '2025-12-31',
    time: '18:00',
    location: 'Powell'
  };

  // Fill in all the event details
  await page.fill('input[placeholder="Event name"]', eventData.title);
  await page.fill('textarea[placeholder="Description (optional)"]', eventData.description);
  await page.fill('input[type="date"]', eventData.date);
  await page.fill('input[type="time"]', eventData.time);
  await page.fill('input[placeholder="Location"]', eventData.location);
  await page.getByRole('button', { name: 'Create Event' }).click();

  // Verify returning to events list
  await expect(page.getByText('Discover Events')).toBeVisible();

  // Refresh events list to see the newly created event
  await page.getByRole('button', { name: 'Refresh' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('heading', { name: eventData.title })).toBeVisible();

  // Search for the new event
  await page.fill('input[placeholder*="Search events"]', eventData.title);
  await expect(page.getByRole('heading', { name: eventData.title })).toBeVisible();

  // Click on the new event to view details
  await page.getByRole('heading', { name: eventData.title }).click();
  await expect(page.getByText(eventData.description)).toBeVisible();
  await expect(page.getByText(eventData.location)).toBeVisible();

  // Join the event
  await page.getByRole('button', { name: 'Join Event' }).click();
  await expect(page.getByRole('button', { name: 'Leave Event' })).toBeVisible();

  // Verify user is RSVPed
  await expect(page.getByText(testUser.name)).toBeVisible();

  // Leave event
  await page.getByRole('button', { name: 'Leave Event' }).click();
  await expect(page.getByRole('button', { name: 'Join Event' })).toBeVisible();
});
