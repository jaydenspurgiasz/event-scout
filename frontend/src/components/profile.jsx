export default function Profile ({setView, name, email}) {
    return (
      <div className="container">
        <div className="card">
          <div>
            <button onClick={() => setView("choice")} className="back-button">
              ← Back
            </button>
            <button onClick={() => setView("settings")} className="settings-button">
              Settings
            </button>
            
          </div>
          <div className="header">
            <h2 className="title">
              {name}
            </h2>
            <p className="subtitle">
              {email}
            </p>
          </div>
          <div className="profile-stats">
            <button onClick={() => setView("followers")}>
              <span className="stat-number">1</span>
              <span className="stat-label"> followers</span>
            </button>
            <button onClick={() => setView("following")}>
              <span className="stat-number">1</span>
              <span className="stat-label"> following</span>
            </button>
          </div>
          <div className="event-section">
            <h2 className="form-title">
              Events
            </h2>
            <div className="event-list">
              <div className="event-item">event1</div>
              <div className="event-item">event2</div>
            </div>
          </div>

        </div>
      </div>
    );
}