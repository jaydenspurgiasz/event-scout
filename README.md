# Event Scout
Introducing Event Scout, a social media style event hub where anyone can post, find, RSVP to events near them. Event organizers post event flyers and details, attendees create an account and sign up or save certain events. The events are automatically synced with the user’s calendar to push notifications before the event. Each event contains its own “group chat” where attendees can meet online beforehand.

### Running Locally: 
### 1. Clone the repo: 
```bash
git clone https://github.com/jaydenspurgiasz/event-scout.git
cd event-scout
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies: 
```bash
cd backend
npm install
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies: 

```bash
cd ../frontend
npm install
```

## To run the Application: 
Run the backend and frontend at the same time

To start the backend server
1. Open the terminal window
2. Navigate to the backend directory: 
 ```bash
   cd backend
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. The backend server will start on **port 3001**
6. You should see: `Server running on port 3001`

To start the frontend server
1. Open a new terminal window (keep the backend running)
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Start the development server on port 3002:
   ```bash
   PORT=3002 npm start
   ```
4. The frontend will automatically open in your browser at **http://localhost:3002**

Once both servers are running:

1. Open your web browser
2. Navigate to: http://localhost:3002
3. You should see the Event Scout homepage with the events list

