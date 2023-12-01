import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";   
import "../node_modules/primeflex/primeflex.css"
import "primereact/resources/primereact.min.css";  

import './App.css';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Main from './pages/Main';


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/" element = {<Main></Main>}></Route>
        <Route exact path="/login" element = {<Login></Login>}></Route>
        <Route exact path="/registration" element = {<Registration></Registration>}></Route>
      </Routes>
    </Router>
    
    </>
  );
}

export default App;
