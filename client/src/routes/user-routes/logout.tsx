import { useContext } from "react";
import { Form, Params, redirect, useNavigate } from "react-router-dom";
import { removeUser } from "../../localDB";
import { UserCreds } from "../../types/user-context";
import { UserCredentails } from "../root";

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
      removeUser();
      return redirect("/");
  }
}

const LogoutPage = () => {
  const navigate = useNavigate();
  const user_credentials = useContext<UserCreds>(UserCredentails);

  return (
    <div className="login-form-container">
      <Form className="logout" method="post">
        <h2>Are you sure You want to Log out?</h2>
        <button
          type="submit"
          name="action"
          value={"Logout"}
          className="btn btn-warning"
          onClick={() => {
            user_credentials.setUserDetails({
              _id: "",
              username: "",
              email: "",
            });
          }}
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
