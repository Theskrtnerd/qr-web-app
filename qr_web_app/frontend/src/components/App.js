import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import CreateEvent from './CreateEvent';
import JoinEvent from './JoinEvent';
import Event from './Event';
import HomePage from './HomePage';
import QRScan from './QRScan';
import NotFound from './NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/join" element={<JoinEvent />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/event/:eventCode" element={<Event />} />
        <Route path="/scan/:eventCode" element={<QRScan />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

// Render the React app into the div with the id 'app'
ReactDOM.render(<App />, document.getElementById('app'));