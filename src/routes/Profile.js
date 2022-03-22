import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(userObj);
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
    }
    refreshUser();
  };

  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const getMyPweets = async () => {
    const q = query(
      collection(dbService, "pweets"),
      orderBy("createdAt", "desc"),
      where("creatorId", "==", `${userObj.uid}`)
    );
    const queryPweets = await getDocs(q);
    queryPweets.forEach((doc) => {
      console.log(doc.id, "=>", doc.data(), "queryPweets");
    });
  };
  useEffect(() => {
    getMyPweets();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={newDisplayName}
          onChange={onChange}
          placeholder="New Display Name"
        />
        <input type="submit" value="Update Profile" />
      </form>
      <br></br>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
export default Profile;
