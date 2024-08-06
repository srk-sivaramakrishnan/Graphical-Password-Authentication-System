import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home';
import Signup1 from './components/Signup/Signup1';
import Signup2 from './components/Signup/Signup2';
import Signup3 from './components/Signup/Signup3';
import Signin1 from './components/Signin/Signin1';
import Signin2 from './components/Signin/Signin2';
import Signin3 from './components/Signin/Signin3';
import ForgotPassword from './components/Reset/ForgotPassword';
import Reset1 from './components/Reset/Reset1';
import Reset2 from './components/Reset/Reset2';
import Reset3 from './components/Reset/Reset3';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup/level1" element={<Signup1 />} />
                <Route path="/signup/level2/:id" element={<Signup2 />} />
                <Route path="/signup/level3/:id" element={<Signup3 />} />
                <Route path="/signin/level1" element={<Signin1 />} />
                <Route path="/signin/level2/:id" element={<Signin2 />} />
                <Route path="/signin/level3/:id" element={<Signin3 />} />
                <Route path="/forgotpassword" element={<ForgotPassword/>} />
                <Route path="/reset/level1/:id" element={<Reset1 />} />
                <Route path="/reset/level2/:id" element={<Reset2 />} />
                <Route path="/reset/level3/:id" element={<Reset3 />} />
            </Routes>
        </Router>
    );
};

export default App;
