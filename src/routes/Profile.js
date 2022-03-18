import { AuthService } from "fbase";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();
  const onLogOutClick = () => {
    AuthService.signOut();
    navigate("/");
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
