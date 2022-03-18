import { AuthService } from "fbase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("")
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        const data = await createUserWithEmailAndPassword(
          AuthService,
          email,
          password
        );
      } else {
        const data = await signInWithEmailAndPassword(
          AuthService,
          email,
          password
        );
      }
    } catch (e) {
      setError(e.message.replace("Firebase: ", ""))
    }
  };
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const toggleAccount = () => setNewAccount((current) => !current);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          required
          value={password}
          onChange={onChange}
        />
        <input
          type="submit"
          value={newAccount ? "Create A New Account" : "Log In"}
        />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Log In" : "Create A New Account"}
      </span>
    </>
  );
};
export default AuthForm;
