import { test, expect } from '@playwright/test';

test('Friending Features Test', async ({ page }) => {
  const user1 = {
    name: 'John Doe',
    email: `john67@yahoo.com`,
    password: 'Pass123!'
  };
  const user2 = {
    name: 'Jane Smith',
    email: `jane@gmail.com`,
    password: 'Password123'
  };

  await page.goto('http://localhost:3000');

  // Register first user
  await page.getByRole('button', { name: 'Register' }).click();
  await page.fill('#name', user1.name);
  await page.fill('#login-email', user1.email);
  await page.fill('#login-password', user1.password);
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page).toHaveURL('http://localhost:3000/home');

  // Navigate to the profile page
  await page.getByRole('button', { name: 'Profile' }).click();
  await expect(page).toHaveURL('http://localhost:3000/profile');

  // Logout user
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL('http://localhost:3000/');

  // Register the second user
  await page.getByRole('button', { name: 'Register' }).click();
  await page.fill('#name', user2.name);
  await page.fill('#login-email', user2.email);
  await page.fill('#login-password', user2.password);
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page).toHaveURL('http://localhost:3000/home');

  // Logout from second user
  await page.getByRole('button', { name: 'Profile' }).click();
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();

  // Login as first user
  await page.getByRole('button', { name: 'Login' }).click();
  await page.fill('#login-email', user1.email);
  await page.fill('#login-password', user1.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('http://localhost:3000/home');

  // Navigate to friends page
  await page.getByRole('button', { name: 'Profile' }).click();
  await page.getByRole('button', { name: /Friends:/ }).click();
  await expect(page).toHaveURL('http://localhost:3000/friends');

  // Search for friends
  await page.getByRole('button', { name: '+ Find Friends' }).click();
  await expect(page).toHaveURL('http://localhost:3000/friend-search');

  // Search for the other user
  await page.waitForTimeout(1000);
  await page.fill('input[placeholder*="Search users"]', user2.name);
  await expect(page.getByText(user2.name)).toBeVisible();

  // Send friend request to other user
  await page.getByRole('button', { name: 'Add +' }).click();
  await expect(page.getByText('Friend request sent!')).toBeVisible();

  // Navigate back to home and logout
  await page.getByRole('button', { name: '← Back' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: '← Back' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: '← Back' }).click();
  await page.getByRole('button', { name: 'Profile' }).click();
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();

  // Login as the second user again
  await page.getByRole('button', { name: 'Login' }).click();
  await page.fill('#login-email', user2.email);
  await page.fill('#login-password', user2.password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Navigate to friend requests Page
  await page.getByRole('button', { name: 'Profile' }).click();
  await page.getByRole('button', { name: /Friends:/ }).click();
  await page.getByRole('button', { name: 'View Requests' }).click();
  await expect(page).toHaveURL('http://localhost:3000/friend-requests');

  // Accept the friend request from the first user
  await expect(page.getByText(user1.name)).toBeVisible();
  await page.getByRole('button', { name: 'Accept' }).click();

  await page.waitForTimeout(500);

  // Verify new friends list
  await page.getByRole('button', { name: '← Back' }).click();
  await expect(page.getByText(user1.name)).toBeVisible();

  // Verify the Friend's profile
  await page.getByText(user1.name).click();
  await expect(page.getByRole('heading', { name: user1.name })).toBeVisible();

  // Navigate back to home to create dummy event
  await page.getByRole('button', { name: '← Back' }).click();
  await page.getByRole('button', { name: 'Discover' }).click();

  // Create dummy event for chat testing
  await page.getByRole('button', { name: 'Create Event' }).click();
  const eventData = {
    title: 'Chat Test',
    description: 'Come chat!',
    date: '2025-12-25',
    time: '00:00',
    location: 'Online'
  };

  // Create event
  await page.fill('input[placeholder="Event name"]', eventData.title);
  await page.fill('textarea[placeholder="Description (optional)"]', eventData.description);
  await page.fill('input[type="date"]', eventData.date);
  await page.fill('input[type="time"]', eventData.time);
  await page.fill('input[placeholder="Location"]', eventData.location);
  await page.getByRole('button', { name: 'Create Event' }).click();

  // Verify event is there and open
  await page.getByRole('button', { name: 'Refresh' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('heading', { name: eventData.title }).click();

  // Join the event as user #2
  await page.getByRole('button', { name: 'Join Event' }).click();

  // Open the chat
  await page.getByRole('button', { name: 'Open Chat' }).click();
  await page.waitForURL(/\/chats\/\d+/);

  // Send a message as user2
  await page.fill('input[placeholder="Type a message..."]', 'Hello World!');
  await page.getByRole('button', { name: 'Send' }).click();
  await page.waitForTimeout(1000);
  await expect(page.getByText('Hello World!')).toBeVisible();

  // Logout user2
  await page.getByRole('button', { name: '← Back' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Profile' }).click();
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();

  // Login as user1
  await page.getByRole('button', { name: 'Login' }).click();
  await page.fill('#login-email', user1.email);
  await page.fill('#login-password', user1.password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Find the dummy event
  await page.fill('input[placeholder*="Search events"]', eventData.title);
  await page.getByRole('heading', { name: eventData.title }).click();

  // Join event as user1
  await page.getByRole('button', { name: 'Join Event' }).click();

  // Open chat
  await page.getByRole('button', { name: 'Open Chat' }).click();

  // Verify message
  await expect(page.getByText('Hello World!')).toBeVisible();

  // Send another message
  await page.fill('input[placeholder="Type a message..."]', 'Hey');
  await page.getByRole('button', { name: 'Send' }).click();
  await page.waitForTimeout(1000);
  await expect(page.getByText('Hey')).toBeVisible();
});
