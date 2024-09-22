import Cookies from "js-cookie";
import "./LoginForm.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { Input } from "../Input/Input";
import { Link } from "react-router-dom";
import axios from "axios";

const cssOverride = {
  marginTop: "1rem",
};

export const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const email = data.email;
    const password = data.password;
    await axios
      .post(`http://localhost:8080/login`, {
        email,
        password,
      })
      .then((resp) => {
        dispatch({ type: "LOGIN", payload: resp.data });
        Cookies.set("user", JSON.stringify(resp.data));
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response.data.message);
      });
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        name={"email"}
        type={"email"}
        placeholder={"Email"}
        register={register}
        errors={errors}
        validationSchema={{
          required: "Email is required!",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Entered value does not match email format.",
          },
        }}
      />
      <Input
        name={"password"}
        type={"password"}
        placeholder={"Password"}
        register={register}
        errors={errors}
        validationSchema={{
          required: "Password is required!",
        }}
      />
      <button>Login</button>
      {loading && (
        <ClipLoader
          color="var(--primary-color)"
          cssOverride={cssOverride}
          loading={loading}
          size={50}
        />
      )}
      {error && <div className="error">{error}</div>}
      <div className="register-link">
        Don't have an account?{" "}
        <Link to="/register" className="register-link-text">
          Register
        </Link>
      </div>
    </form>
  );
};
