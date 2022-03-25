import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { dbService } from "fbase";
import Pweet from "components/Pweet";

const UserProfile = () => {
  const [searchedUser, setSearchedUser] = useState("");
  const [userPweets, setUserPweets] = useState([]);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setSearchedUser(value);
  };
  const onSearchClick = (event) => {
    event.preventDefault();
    const q = query(
      collection(dbService, "pweets"),
      orderBy("createdAt", "desc"),
      where("userID", "==", `${searchedUser}`)
    );
    onSnapshot(q, (snapshot) => {
      const pweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserPweets(pweetArr);
    });
  };

  return (
    <div className="userProfile_container">
      <form onSubmit={onSearchClick} className="userProfile__form">
        <input
          type="text"
          placeholder="Search Username"
          value={searchedUser}
          onChange={onChange}
        />
        <span onClick={onSearchClick}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            color={"#04AAFF"}
            className="maginifyGlass"
          />
        </span>
      </form>
      {userPweets.length !== 0 && (
        <img
          className="userProfile_profile_img"
          src={userPweets[0].profileImg}
        />
      )}
      {userPweets.map((pweet) => (
        <Pweet key={pweet.id} pweetObj={pweet} />
      ))}
    </div>
  );
};
export default UserProfile;
