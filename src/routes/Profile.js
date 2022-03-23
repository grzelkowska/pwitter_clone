import Pweet from "components/Pweet";
import { authService, dbService } from "fbase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ userObj }) => {
  const [ownPweets, setOwnPweets] = useState([]);
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };
  const onEditProfileClick = () => {
    navigate("/editProfile");
  };

  const getMyPweets = async () => {
    const q = query(
      collection(dbService, "pweets"),
      orderBy("createdAt", "desc"),
      where("creatorId", "==", `${userObj.uid}`)
    );
    onSnapshot(q, (snapshot) => {
      const pweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOwnPweets(pweetArr);
    });
  };
  useEffect(() => {
    getMyPweets();
  }, []);

  return (
    <div className="container">
      <img className="profile__img" src={userObj.profileImg} />
      <span className="formBtn" onClick={onEditProfileClick}>
        Edit Profile
      </span>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
      {ownPweets.map((pweet) => (
        <Pweet
          key={pweet.id}
          pweetObj={pweet}
          isOwner={pweet.creatorId === userObj.uid}
        />
      ))}
    </div>
  );
};
export default Profile;
