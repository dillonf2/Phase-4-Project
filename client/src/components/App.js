import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Projects from "./Projects";
import Navbar from "./Navbar";
import Login from "./Login";
import Signup from "./Signup";
import MyReviews from "./MyReviews";
import SubmitProject from "./SubmitProject";
import ClaimOwnership from "./ClaimOwnership";


function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setLoggedIn(true);
    alert("Login Successful!");
  };

  const handleLogout = () => {
    setUser(null);
    setLoggedIn(false)
    alert("Logout Successful!")
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/projects">
          <Projects />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route exact path="/">
          <Home user={user} />
        </Route>
        <Route path="/login">
          <Login handleLogin={handleLogin} />
        </Route>
        {isLoggedIn && (
          <Route path="/my-reviews">
            <MyReviews user={user}/>
          </Route>
        )}
        {isLoggedIn && (
          <Route path="/submit-project">
            <SubmitProject user={user}/>
          </Route>
        )}  
        {isLoggedIn && (
          <Route path="/claim-ownership">
            <ClaimOwnership user={user}/>
          </Route>
        )}                  
      </Switch>
    </div>
  );
}

export default App;