import { storageService, dbService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const PweetFactory = ({ userObj }) => {
  const [pweet, setPweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setPweet(value);
  };
  const onFileChange = (event) => {
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
      setAttachment(result);
    };
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      console.log(attachmentRef);
      await uploadString(attachmentRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(ref(storageService, attachmentRef));
    }
    try {
      await addDoc(collection(dbService, "pweets"), {
        text: pweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
      });
    } catch (error) {
      console.log(`Error adding document: ${error}`);
    }
    setAttachment("");
    setPweet("");
  };
  const onClearAttachment = () => {
    setAttachment("");
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
        value={pweet}
        onChange={onChange}
      />
      <input type="file" accept="image/*" onChange={onFileChange} />
      <input type="submit" value="Pweet" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px " />
          <button onClick={onClearAttachment}>Clear Image</button>
        </div>
      )}
    </form>
  );
};

export default PweetFactory;
