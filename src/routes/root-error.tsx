import { validateHeaderName } from "http";
import React from "react";
import { useRouteError } from "react-router";

const RootErrorElement = () => {
  const error = useRouteError();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Oops...</h1>
      <p>An error has occured.</p>
      <div>
        <span>{error.status}: </span>
        <span>{error.statusText}</span>
      </div>
    </div>
  );
};

export default RootErrorElement;
