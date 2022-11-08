import React, { useState } from "react";
import { Form, Params } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="login-form-container">
      <Form>
        {!isLogin && (
          <label>
            Username:
            <input
              type="text"
              placeholder="JoeStar"
              name="username"
              className="form-control"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </label>
        )}
        <label>
          Email:
          <input
            type="text"
            placeholder="joe@example.com"
            name="email"
            className="form-control"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            placeholder="joe is awesome 123"
            name="password"
            className="form-control"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <button
          type="submit"
          name={isLogin ? "login" : "signIn"}
          className="btn btn-primary"
          onClick={(e) => {
            let valid = isLogin
              ? checkFilled(email, password)
              : checkFilled(username, password, email);
            if (!valid) {
              e.preventDefault();
            }
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
