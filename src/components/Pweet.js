import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";

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
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              {" "}
              <form onSubmit={onSubmitEdit}>
                <input
                  type="text"
                  value={newPweet}
                  onChange={onChangeEdit}
                  required
                />
                <input type="submit" value="Update Pweet" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{pweetObj.text}</h4>
          {pweetObj.attachmentUrl && (
            <img src={pweetObj.attachmentUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={toggleEditing}>Edit</button>
              <button onClick={onDeleteClick}>Delete</button>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default Pweet;
