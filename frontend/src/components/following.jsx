export default function Following({setView}){
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("profile")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Following</h2>
          </div>
        </div>
      </div>
    );
}