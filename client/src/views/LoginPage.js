import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Authentication from "layout/Authentication";
import FormGroup from "components/form/FormGroup";
import Label from "components/form/Label";
import Input from "components/form/Input";
import ErrorMessage from "components/form/ErrorMessage";
import ButtonGradient from "components/button/ButtonGradient";
import { loginUser } from "redux/auth/authRequest";
import Cookies from "js-cookie";

const schema = yup.object({
  email: yup
    .string()
    .required("Please enter your email!")
    .email("This email is not available"),
  password: yup.string().required("Please enter your password"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Twitter | Login";

    const role = localStorage.getItem("role");
    const isBan = localStorage.getItem("isBan");
    
    if (role && isBan === "true") {
      alert("Tài khoản của bạn đã bị khóa.");
      localStorage.removeItem("role");
      localStorage.removeItem("isBan");
      Cookies.remove("tokens");
      navigate("/login");
    }
  }, [navigate]);

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
    setError,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth.login);

  const handleLogin = (values) => {
    dispatch(
      loginUser({
        userData: values,
        reset,
        setError,
        navigate,
      })
    ).then((res) => {
      if (res?.data) {
        const { role, isBan } = res.data;

        if (isBan === true) {
          alert("Tài khoản của bạn đã bị khóa.");
          
          localStorage.removeItem("role");
          localStorage.removeItem("isBan");
          Cookies.remove("tokens");
        } else {
          localStorage.setItem("role", role);
          localStorage.setItem("isBan", isBan.toString());

          if (role === 1) {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        }
      } else {
        console.error("Không nhận được role từ backend");
      }
    });
  };
  return (
    <Authentication heading="Log in">
      <form
        className="flex flex-col gap-y-5"
        autoComplete="off"
        onSubmit={handleSubmit(handleLogin)}
      >
        <FormGroup className="mb-4">
          <Label className="mb-3" name="email">
            Email *
          </Label>
          <Input
            placeholder="name@gmail.com"
            type="email"
            control={control}
            name="email"
            error={isDirty && errors?.email}
          ></Input>
          {errors?.email && (
            <ErrorMessage className="-bottom-1">
              {errors?.email?.message}
            </ErrorMessage>
          )}
        </FormGroup>
        <FormGroup>
          <Label className="mb-3" name="password">
            Password *
          </Label>
          <Input
            placeholder="Enter your password"
            type="password"
            control={control}
            name="password"
            error={errors?.password}
          ></Input>
          {errors?.password && (
            <ErrorMessage className="-bottom-1">
              {errors?.password?.message}
            </ErrorMessage>
          )}
        </FormGroup>
        <p className="mt-4 text-sm font-normal">
          <Link to="/forgot-password" className="font-medium text-primary">
            Forgot password?
          </Link>
        </p>
        <div className="mt-8 text-center">
          <ButtonGradient
            className="w-[60%] py-[14px] text-[22px] leading-9 font-semibold rounded-xl"
            type="submit"
            isLoading={isLoading}
            sizeLoading="36px"
          >
            Sign In
          </ButtonGradient>
          <p className="mt-4 text-sm font-normal">
            Don't have an account yet?{" "}
            <Link to={"/register"} className="font-medium text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </Authentication>
  );
};

export default LoginPage;
