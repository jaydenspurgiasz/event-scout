// Simple mock events for local testing without backend
export const mockEvents = [
	{
		id: 1001,
		title: 'EventScout Launch Party',
		date: new Date().toISOString(),
		location: 'San Francisco, CA',
		description: 'Celebrate the launch of EventScout with snacks, demos, and chats.',
		private: false,
	},
	{
		id: 1002,
		title: 'React Meetup',
		date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
		location: 'Remote',
		description: 'Monthly meetup to discuss hooks, performance, and ecosystem updates.',
		private: false,
	},
];
