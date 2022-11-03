import { useState } from "react";
import { Form } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="login-form-container">
      <Form>
        <label>
          Username:
          <input
            type="text"
            placeholder="username"
            name="username"
            className="form-control"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            placeholder="password"
            name="password"
            className="form-control"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <button type="submit" name="login" className="btn btn-primary">
          Login
        </button>
        <label>
          New user?
          <button type="submit" name="switch" className="btn btn-link btn-sm">
            Sign up
          </button>
        </label>
      </Form>
    </div>
  );
};

export default Login;
