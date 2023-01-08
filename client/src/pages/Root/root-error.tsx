import { useRouteError } from "react-router";
import { Link } from "react-router-dom";
import SimpleBGSVG from "@images/simple-bg.svg";

const RootErrorElement = () => {
  const error = useRouteError();
  // console.log({ error });
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `url(${SimpleBGSVG}) no-repeat center center cover`,
      }}
    >
      <h1>Oops...</h1>
      <p>An error has occured.</p>
      <div>
        {error &&
        typeof error === "object" &&
        "status" in error &&
        error.status ? (
          <>
            <span>
              {typeof error.status === "string" ? error.status : null}
            </span>
          </>
        ) : (
          <span>
            {error &&
            typeof error === "object" &&
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

export default RootErrorElement;
