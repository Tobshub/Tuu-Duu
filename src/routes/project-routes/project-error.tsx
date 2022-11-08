import React from "react";
import { useRouteError } from "react-router";

const ProjectErrorElement = () => {
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
        {error.status ? (
          <>
            <span>{error.status}: </span>
            <span>{error.statusText}</span>
          </>
        ) : (
          <span>{error.message}</span>
        )}
      </div>
    </div>
  );
};

export default ProjectErrorElement;
