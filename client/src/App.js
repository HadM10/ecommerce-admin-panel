import React from 'react';
import AppRoutes from './routes'; // Ensure this imports the correct component
import './styles/tailwind.css';

const App = () => {
  return (
    <div>
      <AppRoutes /> {/* Ensure this uses the Routes component */}
    </div>
  );
};

export default App;
