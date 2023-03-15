import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import CallPage from './pages/CallPage';
import LandingPage from './pages/LandingPage';



function App() {

  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/call/:callerID" element={<CallPage/>}/>
        </Routes>
    </div>
  );
}

export default App;