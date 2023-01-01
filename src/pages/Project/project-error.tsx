import { useRouteError } from "react-router";
import { Link } from "react-router-dom";

const ProjectErrorElement = () => {
  const error = useRouteError();
  // console.error(error);
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
            <span>
              {typeof error.status === "string" ? error.status : null}
            </span>
          </>
        ) : (
          <span>
            {typeof error === "object" &&
            "message" in error &&
            typeof error.message === "string"
              ? error.message
              : null}
          </span>
        )}
      </div>
      <h2>Solutions:</h2>
      <ul>
        <li>Reload the page</li>
        <li>
          <Link to="/">Go back home</Link>
        </li>
      </ul>
    </div>
  );
};

export default ProjectErrorElement;
