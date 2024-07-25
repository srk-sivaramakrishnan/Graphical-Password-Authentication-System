import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home';
import Signin1 from './components/Signin/Signin1';
import Signup2 from './components/Signup/Signup2';
import Signup1 from './components/Signup/Signup1';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup/level1" element={<Signup1 />} />
        <Route path="/signup2/:id" element={<Signup2 />} />
        <Route path="/signin/level1" element={<Signin1 />} />
      </Routes>
    </Router>
  );
};

export default App;
