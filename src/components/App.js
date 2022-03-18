import { AuthService } from "fbase";
import React, { useEffect, useState } from "react";
import AppRouter from "./Router";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    AuthService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn}></AppRouter> : "Initializing"}
      <br></br>
      <footer>&copy; {new Date().getFullYear()} Pwitter</footer>
    </>
  );
}

export default App;
