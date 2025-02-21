import './App.css';
import Users from './components/Users';

// Main App component
function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>User Management System</h1>
      </header>
      <main>
        <Users />
      </main>
    </div>
  );
}

export default App;
