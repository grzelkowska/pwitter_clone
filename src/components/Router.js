import React, { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Auth from "routes/Auth";
import Navigation from "components/Navigation";

const AppRouter = ({isLoggedIn}) => {
  return (
    <Router>
      {isLoggedIn && <Navigation></Navigation>}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/profile" element={<Profile />}></Route>
          </>
        ) : (
          <Route exact path="/" element={<Auth />}></Route>
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
