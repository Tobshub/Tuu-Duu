import React from "react";
import { useRouteError } from "react-router";

const ProjectErrorElement = () => {
  const error = useRouteError();
  console.error(error);
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
        {typeof error === "object" && "status" in error && error.status ? (
          <>
            <span>{typeof error.status === "string" && error.status}</span>
          </>
        ) : (
          <span>{JSON.stringify(error)}</span>
        )}
      </div>
    </div>
  );
};

export default ProjectErrorElement;
