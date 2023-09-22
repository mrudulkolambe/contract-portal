import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Document from './pages/Document';
import Login from './pages/Login';
import Contracts from './pages/Contracts';
import { AuthContextProvider } from './context/auth';
import { DataContextProvider } from './context/data';

function App() {
  return (
    <>
      <Router>
        <AuthContextProvider>
          <DataContextProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/create" element={<Document />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/contract/:id" element={<Document />} />
            </Routes>
          </DataContextProvider>
        </AuthContextProvider>
      </Router>
    </>
  );
}

export default App;
