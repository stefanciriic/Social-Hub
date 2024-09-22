import "./RegisterForm.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { Input } from "../Input/Input";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const cssOverride = {
  marginTop: "1rem",
};

export const RegisterForm = () => {
  const [success, setSuccess] = useState("");
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
    const firstName = data.firstName;
    const lastName = data.lastName;
    const email = data.email;
    const password = data.password;
    await axios
      .post(`http://localhost:8080/register`, {
        firstName,
        lastName,
        email,
        password,
      })
      .then((resp) => {
        setError("");
        setSuccess(resp.data.message);
        setTimeout(() => {
          const { message, ...rest } = resp.data;
          dispatch({ type: "LOGIN", payload: rest });
          Cookies.set("user", JSON.stringify(rest));
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        setLoading(false);
        setSuccess("");
        setError(error.response.data.message);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Register</h1>
      <Input
        name={"firstName"}
        type={"text"}
        placeholder={"First name"}
        register={register}
        errors={errors}
        validationSchema={{
          required: "First name is required!",
          minLength: {
            value: 3,
            message: "First name must be between 3 and 30 characters.",
          },
        }}
      />
      <Input
        name={"lastName"}
        type={"text"}
        placeholder={"Last name"}
        register={register}
        errors={errors}
        validationSchema={{
          required: "Last name is required!",
          minLength: {
            value: 3,
            message: "Last name must be between 3 and 30 characters.",
          },
        }}
      />
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
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters..",
          },
        }}
      />
      <button>Register</button>
      {loading && (
        <ClipLoader
          color="var(--primary-color)"
          cssOverride={cssOverride}
          loading={loading}
          size={50}
        />
      )}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <div className="register-link">
        Already have account?{" "}
        <Link to="/login" className="register-link-text">
          Login
        </Link>
      </div>
    </form>
  );
};
