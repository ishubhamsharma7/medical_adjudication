import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PatientDetail from './components/DetailPage';
import ChatBotWidget from './components/ChatBotWidget';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patient-detail/:patientId" element={
            <>
              <PatientDetail />
              <ChatBotWidget />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
