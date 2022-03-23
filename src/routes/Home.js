import React, { useEffect, useState } from "react";
import PweetFactory from "components/PweetFactory";
import Pweet from "components/Pweet";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { dbService } from "fbase";

const Home = ({ userObj }) => {
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

  return (
    <div className="container">
      <img className="profile__img" src={userObj.profileImg} />
      <PweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {pweets.map((pweet) => (
          <Pweet
            key={pweet.id}
            pweetObj={pweet}
            isOwner={pweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
