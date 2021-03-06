import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Auth from "routes/Auth";
import EditProfile from "routes/EditProfile";
import UserProfile from "routes/UserProfile";
import Navigation from "components/Navigation";

const AppRouter = ({ isLoggedIn, userObj, refreshUser }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj}></Navigation>}
      <div
        style={{
          maxWidth: 890,
          width: "100%",
          margin: "0 auto",
          marginTop: 80,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Routes>
          {isLoggedIn ? (
            <>
              <Route
                exact
                path="/"
                element={<Home userObj={userObj} />}
              ></Route>
              <Route
                exact
                path="/profile"
                element={<Profile userObj={userObj} />}
              ></Route>
              <Route
                exact
                path="/editProfile"
                element={
                  <EditProfile refreshUser={refreshUser} userObj={userObj} />
                }
              ></Route>
              <Route
                exact
                path="/userProfile"
                element={<UserProfile />}
              ></Route>
            </>
          ) : (
            <Route exact path="/" element={<Auth />}></Route>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
