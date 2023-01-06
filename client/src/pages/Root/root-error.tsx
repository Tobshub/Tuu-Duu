import { useRouteError } from "react-router";

const RootErrorElement = () => {
  const error = useRouteError();
  console.log({ error });
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
        {error && typeof error === "object" && "status" in error ? (
          <span>{error.status.toString()}</span>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default RootErrorElement;
