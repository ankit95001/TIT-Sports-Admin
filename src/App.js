import './App.css';
import Navbar from './components/Navbar';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import RealtimeData from './components/realtimeData';
import UserRegistration from './components/UserRegistration';
import Home from './components/home/Home';
import Certificates from './components/certificates';
import Highlights from './components/highlights/Highlights';

 
function App() {
  const [mode, setMode] = useState('light'); // Whether dark mode is enabled or not


  const toggleMode = ()=>{
    if(mode === 'light'){
      setMode('dark');
      document.body.style.backgroundColor = '#042743';
    }
    else{
      setMode('light');
      document.body.style.backgroundColor = 'white';
    }
  }
  return (
    <>
    <Router>
    <Navbar title="TIT Sports" mode={mode} toggleMode={toggleMode} key={new Date()} />
    <div className="container my-3">
    <Switch>
    {/* /users --> Component 1
        /users/home --> Component 2 */}
          <Route exact path="/studentList">
            {/* <About mode={mode} /> */}
            <RealtimeData mode={mode}/>
          </Route>

          <Route exact path="/sportsRegistration">
            <UserRegistration mode={mode}/>
          </Route>
          <Route exact path="/certificates">
            <Certificates mode={mode}/>
          </Route>
          <Route exact path="/highlights">
            <Highlights mode={mode}/>
          </Route>

          <Route exact path="/">
            <Home mode={mode}/>
          </Route>
    </Switch>
    </div>
    </Router>
    </> 
  );
}

export default App;