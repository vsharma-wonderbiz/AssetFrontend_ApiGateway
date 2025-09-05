import React from 'react';
import Menu1 from './Components/menu1.jsx';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignalsTable from './Components/SignalsTable.jsx';
import AuthForm from './Components/AuthFrom.jsx';
import ErrorPage from './Components/ErrorPage.jsx';

const App = () => {
  return (
    <>
      <Router>
        <ToastContainer />

        <Routes>
          {/* Default route redirects to /Dashboard */}
          <Route path="/" element={<Navigate to="/Register" />} />

          {/* Your routes */}
          <Route path="/Dashboard" element={<Menu1 />} />
          <Route path="/display-signals" element={<SignalsTable />} />
          <Route path="/Register" element={<AuthForm />} />
          <Route path="/fileError" element={<ErrorPage/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
