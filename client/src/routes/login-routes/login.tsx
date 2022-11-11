import { reference } from "@popperjs/core";
import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Params,
  redirect,
  useActionData,
  useNavigate,
} from "react-router-dom";
import { AppUser, LoginServerResponse } from "../../types/server-response";

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
    const api_data = await fetch("http://localhost:2005/api/login", {
      method: "POST",
      body: JSON.stringify(request_body),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((data) => data.json())
      .then((data: LoginServerResponse) => {
        return data.user;
      })
      .catch((e) => console.error(e.message));
    return api_data ? (api_data.email ? true : false) : false;
  }
}

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const submitBtn = useRef<HTMLButtonElement | null>(null);
  const is_valid_user = useActionData();
  const navigate = useNavigate();

  useEffect(() => {
    submitBtn.current ? (submitBtn.current.disabled = false) : null;
  }, [submitBtn.current?.disabled]);

  useEffect(() => {
    if (is_valid_user) {
      console.log("logged in");
      navigate("/");
    }
  }, [is_valid_user]);

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
              onChange={(e) =>
                setUser((state) => {
                  return { ...state, username: e.target.value };
                })
              }
            />
          </label>
        )}
        <label>
          Email:
          <input
            type="email"
            placeholder="joe@example.com"
            name="email"
            className="form-control"
            value={user.email}
            onChange={(e) =>
              setUser((state) => {
                return { ...state, email: e.target.value };
              })
            }
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
            onChange={(e) =>
              setUser((state) => {
                return { ...state, password: e.target.value };
              })
            }
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
            {isLogin ? "Sign in" : "Login"}
          </button>
        </label>
      </Form>
    </div>
  );
};

export default Login;

function checkFilled(...args: string[]) {
  return args.every((value) => value.length > 0);
}
