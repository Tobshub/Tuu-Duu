import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Form,
  Params,
  redirect,
  useActionData,
  useNavigate,
} from "react-router-dom";
import { syncProjects } from "../../dummyDB";
import { AppUser, LoginServerResponse } from "../../types/server-response";
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
  const { username, email, password, ...formData } = Object.fromEntries(res);
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
  const is_valid_user = useActionData();
  const navigate = useNavigate();
  const user_credentials = useContext<UserCreds>(UserCredentails);
  const [loginError, showLoginError] = useState(false);

  useEffect(() => {
    submitBtn.current ? (submitBtn.current.disabled = false) : null;
  }, [submitBtn.current?.disabled]);

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
    showLoginError(false);
  }

  return (
    <div className="login-form-container">
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
          <span style={{ color: "red" }}>
            Username or Password is incorrect
          </span>
        )}
        <label>
          Email:
          <input
            type="email"
            placeholder="joe@example.com"
            name="email"
            className="form-control"
            value={user.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            placeholder="joe is awesome 123"
            name="password"
            className="form-control"
            value={user.password}
            onChange={handleChange}
          />
        </label>
        <button
          type="submit"
          name="action"
          value={isLogin ? "Login" : "SignUp"}
          className="btn btn-primary"
          ref={submitBtn}
          onClick={(e) => {
            let valid = isLogin
              ? checkFilled(user.email, user.password)
              : checkFilled(user.username, user.email, user.password);
            if (!valid) {
              e.preventDefault();
              return;
            }
            setTimeout(() => {
              submitBtn.current ? (submitBtn.current.disabled = true) : null;
            }, 100);
          }}
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <label>
          {isLogin ? "New user" : "Already have an account"}?
          <button
            type="button"
            className="btn btn-link btn-sm"
            onClick={() => {
              setIsLogin(!isLogin);
            }}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </label>
      </Form>
    </div>
  );
};

export default LoginPage;

function checkFilled(...args: string[]) {
  return args.every((value) => value.length > 0);
}
