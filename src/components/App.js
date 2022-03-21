import { authService } from "fbase";
import React, { useEffect, useState } from "react";
import AppRouter from "./Router";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter userObj={userObj} isLoggedIn={Boolean(userObj)}></AppRouter>
      ) : (
        "Initializing"
      )}
      <br></br>
      <footer>&copy; {new Date().getFullYear()} Pwitter</footer>
    </>
  );
}

export default App;
