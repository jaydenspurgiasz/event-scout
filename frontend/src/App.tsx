import './index.css';

function App() {
  return (
    <div>
      <div style={{ backgroundColor: '#4a90e2', color: 'white', padding: '20px' }}>
        <h1>Event Scout</h1>
      </div>
      <div style={{ padding: '20px' }}>
        <h2>Events</h2>
        <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px' }}>
          <h3>Study Session</h3>
          <p>December 5, 2025</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px' }}>
          <h3>Basketball Game</h3>
          <p>December 6, 2025</p>
        </div>
      </div>
    </div>
  );
}

export default App;
