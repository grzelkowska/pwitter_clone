import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Pweet = ({ pweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newPweet, setNewPweet] = useState(pweetObj.text);
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
          <h4>{pweetObj.text}</h4>
          {pweetObj.attachmentUrl && <img src={pweetObj.attachmentUrl} />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
            // <>
            //   <button onClick={toggleEditing}>Edit</button>
            //   <button onClick={onDeleteClick}>Delete</button>
            // </>
          )}
        </>
      )}
    </div>
  );
};
export default Pweet;
