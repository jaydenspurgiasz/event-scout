export default function choice({ setView }) {
    return (
      <div className="container">
        <div className="card">
          <div className="header">
            <div>
              <h2 className="title">Welcome to Event Scout</h2>
              <p className="subtitle">Plan, Post, and RSVP to Amazing Events!</p>
            </div>
          </div>
          <div className="button-group">
            <button onClick={() => setView("login")} className="button-primary">
              Login
            </button>
            <button onClick={() => setView("register")} className="button-secondary">
              Register
            </button>
            <button onClick={() => setView("profile")} className="button-secondary">
              Test Profile
            </button>
            <button onClick={() => setView("chat-list")} className="button-secondary">
              Test Chat
            </button>
          </div>
        </div>
      </div>
    );
}