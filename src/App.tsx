import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
// import Landing from './pages/Landing/Landing';
import { AuthProvider, useAuth } from './context/authContext';
import './App.css';

const AppRoutes = () => {
  const auth = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          !auth.isAuthenticated ? <Login /> : <Navigate to="/characters" />
        }
      />
      <Route
        path="/characters"
        element={auth.isAuthenticated ? <Landing /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
