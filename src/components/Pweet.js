import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Pweet = ({ pweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newPweet, setNewPweet] = useState(pweetObj.text);
  const [imgClicked, setImgClicked] = useState(false);
  const toggleEditing = () => setEditing((prev) => !prev);
  const onChangeEdit = (event) => {
    const {
      target: { value },
    } = event;
    setNewPweet(value);
  };
  const onSubmitEdit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(dbService, "pweets", `${pweetObj.id}`), {
      text: newPweet,
    });
    setEditing(false);
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure to delete this pweet?");
    if (ok) {
      await deleteDoc(doc(dbService, "pweets", `${pweetObj.id}`));
      if (pweetObj.attachmentUrl) {
        await deleteObject(ref(storageService, pweetObj.attachmentUrl));
      }
    }
  };
  const onImageClick = () => {
    setImgClicked((prev) => !prev);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              {" "}
              <form onSubmit={onSubmitEdit} className="container nweetEdit">
                <input
                  type="text"
                  value={newPweet}
                  onChange={onChangeEdit}
                  placeholder="Edit your pweet"
                  autoFocus
                  required
                  className="formInput"
                />
                <input type="submit" value="Update Pweet" className="formBtn" />
              </form>
              <span onClick={toggleEditing} className="formBtn cancelBtn">
                Cancel
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <img className="nweet_profile_img" src={pweetObj.profileImg} />
          <span className="userID">{pweetObj.userID}</span>
          <h4>{pweetObj.text}</h4>
          {pweetObj.attachmentUrl && (
            <img
              className="nweet_img"
              src={pweetObj.attachmentUrl}
              onClick={onImageClick}
            />
          )}
          {imgClicked && (
            <dialog
              className="dialog"
              onClick={onImageClick}
              open
              style={{ position: "absolute" }}
            >
              <img className="image" src={pweetObj.attachmentUrl} />
            </dialog>
          )}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Pweet;
