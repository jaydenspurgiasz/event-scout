import { useNavigate } from 'react-router-dom';

export default function Followers(){
    const navigate = useNavigate();
    
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => navigate("/profile")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Followers</h2>
          </div>
        </div>
      </div>
    );
}