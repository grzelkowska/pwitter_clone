import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import blankProfile from "../img/blank-profile.png";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          profileImg: blankProfile,
          updateProfile: () =>
            updateProfile(user, { displayName: user.displayName }),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const [pweets, setPweets] = useState([]);
  useEffect(() => {
    const q = query(
      collection(dbService, "pweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const pweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPweets(pweetArr);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      profileImg: blankProfile,
      updateProfile: () =>
        updateProfile(user, { displayName: user.displayName }),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          userObj={userObj}
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          pweetObj={pweets}
        />
      ) : (
        "Initializing"
      )}
      <br></br>
      <footer className="footer">
        &copy; {new Date().getFullYear()} Pwitter
      </footer>
    </>
  );
}

export default App;
