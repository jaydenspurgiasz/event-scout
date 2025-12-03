export default function AppNav({ currentPage, onPageChange }) {
  return (
    <nav className="app-nav">
      <button 
        className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
        onClick={() => onPageChange('home')}
      >
        Discover
      </button>
      <button 
        className={`nav-button ${currentPage === 'create' ? 'active' : ''}`}
        onClick={() => onPageChange('create')}
      >
        Create
      </button>
      <button 
        className={`nav-button ${currentPage === 'profile' ? 'active' : ''}`}
        onClick={() => onPageChange('profile')}
      >
        Profile
      </button>
    </nav>
  );
}

