import { useNavigate } from 'react-router-dom';

export default function Friends(){
    const navigate = useNavigate();
    
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => navigate("/profile")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Friends</h2>
          </div>
        </div>
      </div>
    );
}