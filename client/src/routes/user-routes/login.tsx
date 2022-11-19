import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Form,
  Params,
  redirect,
  useActionData,
  useNavigate,
} from "react-router-dom";
import { getCurrentUser, syncProjects } from "../../localDB";
import { AppUser, LoginServerResponse } from "../../types/server-response";
import { UserCreds } from "../../types/user-context";
import { UserCredentails } from "../root";
import password_encrypt from "./password";

export async function loader({ params }: { params: Params<string> }) {
  getCurrentUser().then((user) => {
    if (user && user._id) {
      return redirect("/");
    }
  });
}

export async function action({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) {
  const res = await request.formData();
  const {
    username,
    email,
    password: raw_password,
    ...formData
  } = Object.fromEntries(res);
  const password = password_encrypt(raw_password.toString());
  if (formData.action) {
    let request_body;
    switch (formData.action) {
      case "Login":
        request_body = {
          user_details: {
            email,
            password,
          },
        };
        break;
      case "SignUp":
        request_body = {
          user_details: {
            username,
            email,
            password,
          },
        };
        break;
    }
    const user_api_url =
      formData.action === "Login"
        ? "https://tuu-duu-api.onrender.com/api/login"
        : "https://tuu-duu-api.onrender.com/api/login/new";
    const user_api_data = await fetch(user_api_url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(request_body),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((data) => data.json())
      .then((data: LoginServerResponse) => {
        if (data.success) {
          return data.user;
        }
        console.log("invalid");
        return false;
      })
      .catch((e) => console.error(e.message));
    return user_api_data;
  }
}

const LoginPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const submitBtn = useRef<HTMLButtonElement | null>(null);
  const passwordInput = useRef<HTMLInputElement | null>(null);
  const is_valid_user = useActionData();
  const navigate = useNavigate();
  const user_credentials = useContext<UserCreds>(UserCredentails);
  const [loginError, showLoginError] = useState(false);
  const [inputError, showInputError] = useState(false);
  const [showPassword, toggleShowPassword] = useState(false);

  useEffect(() => {
    toggleShowPassword(false);
    setUser({
      email: "",
      password: "",
      username: "",
    });
  }, [isLogin]);

  useEffect(() => {
    if (is_valid_user) {
      user_credentials
        .setUserDetails(is_valid_user)
        .then(async () => await syncProjects())
        .finally(() => navigate("/"));
    } else if (is_valid_user === false) {
      showLoginError(true);
    }
  }, [is_valid_user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUser((state) => ({ ...state, [name]: value }));
    submitBtn.current ? (submitBtn.current.disabled = false) : null;
    showLoginError(false);
    showInputError(false);
  }

  return (
    <div className="login-form-container">
      <div className="login-form-back">
        <button
          className="btn btn-primary"
          onClick={() => {
            navigate("/");
          }}
        >
          Back to home
        </button>
      </div>
      <Form method="post">
        {!isLogin && (
          <label>
            Username:
            <input
              type="text"
              placeholder="JoeStar"
              name="username"
              className="form-control"
              value={user.username}
              onChange={handleChange}
            />
          </label>
        )}
        {loginError && (
          <span style={{ color: "red" }}>Email or Password is incorrect</span>
        )}
        <label>
          Email:
          <input
            type="email"
            required
            placeholder="joe@example.com"
            name="email"
            className="form-control"
            value={user.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password:
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              required
              ref={passwordInput}
              placeholder="joe is awesome 123"
              name="password"
              className="form-control"
              value={user.password}
              onChange={handleChange}
            />
            <span className="input-group-btn" style={{ padding: "0" }}>
              <button
                type="button"
                style={{
                  padding: ".5em .75em",
                  fontSize: "14px",
                  height: "100%",
                  borderRadius: "0 5px 5px 0",
                }}
                className="btn btn-danger"
                onClick={() => {
                  toggleShowPassword((state) => !state);
                  passwordInput.current ? passwordInput.current.focus() : null;
                }}
              >
                Show Password
              </button>
            </span>
          </div>
          {inputError && (
            <span style={{ color: "red" }}>Password is too short</span>
          )}
        </label>
        <button
          type="submit"
          name="action"
          value={isLogin ? "Login" : "SignUp"}
          className="btn btn-primary"
          ref={submitBtn}
          onClick={(e) => {
            if (user.password.length < 8) {
              console.log("short password");
              e.preventDefault();
              showInputError(true);
            }
            setTimeout(() => {
              submitBtn.current ? (submitBtn.current.disabled = true) : null;
            }, 50);
          }}
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <div>
          <label>{isLogin ? "New user" : "Already have an account"}?</label>
          <button
            type="button"
            className="btn btn-link btn-sm"
            onClick={() => {
              setIsLogin(!isLogin);
            }}
            style={{ fontSize: "18px" }}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
