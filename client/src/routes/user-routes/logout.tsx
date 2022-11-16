import { Form, Params, redirect, useNavigate } from "react-router-dom";

export async function action({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) {
  const res = await request.formData();
  const formData = Object.fromEntries(res);
  switch (formData.action) {
    case "Logout":
      // remove user stored in:
      //  - localforage
      //  - UserCredentials context
      return redirect("/");
  }
}

const LogoutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="login-form-container">
      <Form className="logout" method="post">
        <h2>Are you sure You want to Log out?</h2>
        <button
          type="submit"
          name="action"
          value={"Logout"}
          className="btn btn-warning"
        >
          Logout
        </button>
        <button
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          Back
        </button>
      </Form>
    </div>
  );
};

export default LogoutPage;
