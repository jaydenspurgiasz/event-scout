export default function AppNav({ currentPage, onPageChange, onHomeClick, onProfileClick }) {
  return (
    <nav className="app-nav">
      <button 
        className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
        onClick={onHomeClick}
      >
        Home
      </button>
      <button 
        className={`nav-button ${currentPage === 'create' ? 'active' : ''}`}
        onClick={() => onPageChange('create')}
      >
        Create
      </button>
      <button 
        className="nav-button"
        onClick={onProfileClick}
      >
        Profile
      </button>
    </nav>
  );
}

