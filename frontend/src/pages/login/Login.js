import "./Login.css";
import { LoginForm } from "../../components/Login/LoginForm";

export const Login = () => {
  return (
    <div className="login">
      <div className="login-left">
        <LoginForm />
      </div>
      <div className="login-right">
        <h1>Social Hub</h1>
      </div>
    </div>
  );
};
