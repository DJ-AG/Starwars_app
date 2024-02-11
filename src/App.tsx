import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Landing from './pages/Landing/Landing';
import { AuthProvider, useAuth } from './context/authContext';
import './App.css';

// Define the routes of the application
const AppRoutes = () => {
  // Check the authentication status using the useAuth hook
  const auth = useAuth();

  return (
    <Routes>
      {/* Route for the login page */}
      <Route
        path="/"
        element={
          // If the user is not authenticated, render the Login component,
          // otherwise redirect to the characters page
          !auth.isAuthenticated ? <Login /> : <Navigate to="/characters" />
        }
      />
      {/* Route for the characters page */}
      <Route
        path="/characters"
        element={
          // If the user is authenticated, render the Landing component,
          // otherwise redirect to the root page
          auth.isAuthenticated ? <Landing /> : <Navigate to="/" />
        }
      />
    </Routes>
  );
};

// Main App component
const App = () => {
  return (
    <AuthProvider>
      {/* Wrap the AppRoutes component with the AuthProvider */}
      <BrowserRouter>
        {/* Use BrowserRouter for routing */}
        <AppRoutes /> {/* Render the defined routes */}
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
