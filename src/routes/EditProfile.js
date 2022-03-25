import { authService, storageService } from "fbase";
import { updateProfile } from "firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const EditProfile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newProfileImage, setNewProfileImage] = useState("");
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(userObj);

    let newProfileImageUrl = "";
    if (newProfileImage !== "") {
      const newProfileImageRef = ref(
        storageService,
        `${userObj.uid}/${uuidv4()}`
      );
      await uploadString(newProfileImageRef, newProfileImage, "data_url");
      newProfileImageUrl = await getDownloadURL(
        ref(storageService, newProfileImageRef)
      );
    }

    const oldProfilePicString = userObj.photoURL
      .replace("%2F", " ")
      .replace("?alt=media&token=", " ")
      .split(" ");
    const deleteRef = ref(
      storageService,
      `${userObj.uid}/${oldProfilePicString[1]}`
    );
    deleteObject(deleteRef)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });

    await updateProfile(authService.currentUser, {
      photoURL: newProfileImageUrl,
      displayName: newDisplayName,
    });
    setNewProfileImage("");
    refreshUser();
  };
  const onProfileImageChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setNewProfileImage(result);
    };
  };

  const onClearProfileImg = () => {
    setNewProfileImage("");
  };

  return (
    <div className="editProfile">
      <img className="profile__img" src={userObj.photoURL} />
      <form onSubmit={onSubmit} className="editProfile">
        <input
          type="text"
          autoFocus
          value={newDisplayName}
          onChange={onChange}
          placeholder="New Display Name"
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
        <label htmlFor="profile-attach-file" className="profileImg__label">
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="profile-attach-file"
          type="file"
          accept="image/*"
          onChange={onProfileImageChange}
          style={{ opacity: 0 }}
        />
        {newProfileImage && (
          <div className="profileImg__attachment">
            <img
              src={newProfileImage}
              style={{ backgroundImage: newProfileImage }}
            />
            <div className="profileImg__clear" onClick={onClearProfileImg}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditProfile;
