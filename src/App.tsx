import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  console.log("App component rendering...");
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;