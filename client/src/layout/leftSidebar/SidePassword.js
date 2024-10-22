import FormGroup from "components/form/FormGroup";
import Input from "components/form/Input";
import Label from "components/form/Label";
import React from "react";
import { logoutUser } from "redux/auth/authRequest";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMessage from "components/form/ErrorMessage";
import ButtonGradient from "components/button/ButtonGradient";
import axios from "api/config";
import Cookies from "js-cookie";

const schema = yup.object({
  currentPassword: yup.string().required("This is required field"),
  newPassword: yup
    .string()
    .required("This is required field")
    .min(6, "Password must be 6 characters or more")
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,})$/,
      "Password must be at least 1 uppercase, 1 lowercase and 1 number"
    ),
  confirmPassword: yup.string().required("This is required field"),
});

const SidePassword = () => {
  const dispatch = useDispatch();
  const {
    formState: { isDirty, errors, isSubmitting },
    handleSubmit,
    control,
    reset,
    setError,
  } = useForm({ mode: "onSubmit", resolver: yupResolver(schema) });
  const handleChangePassword = async (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;
    try {
      if (confirmPassword === newPassword) {
        await axios.put(
          "/auth/change-password",
          {
            currentPassword,
            newPassword,
          },
          {
            headers: {
              authorization: "Bearer " + Cookies.get("tokens"),
            },
          }
        );
        reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        logoutUser(dispatch);
      } else
        setError("confirmPassword", {
          message: "Confirmation password must match the new password",
        });
    } catch (error) {
      if (error.response.status === 400)
        setError("currentPassword", {
          message: "Current password is not correct",
        });
    }
  };
  return (
    <form
      onSubmit={handleSubmit(handleChangePassword)}
      className="flex flex-col px-5 py-4 gap-y-5"
    >
      <FormGroup>
        <Label name="currentPassword" className="mb-1 text-[15px]">
          Current password*
        </Label>
        <Input
          name="currentPassword"
          placeholder="Type current password in here"
          type="password"
          control={control}
          error={errors?.currentPassword}
        ></Input>
        {errors?.currentPassword && (
          <ErrorMessage className="-bottom-[2px]">
            {errors.currentPassword?.message}
          </ErrorMessage>
        )}
      </FormGroup>
      <FormGroup>
        <Label name="newPassword" className="mb-1 text-[15px]">
          New password*
        </Label>
        <Input
          name="newPassword"
          placeholder="Type new password in here"
          type="password"
          error={errors?.newPassword}
          control={control}
        ></Input>
        {errors?.newPassword && (
          <ErrorMessage className="-bottom-[2px]">
            {errors.newPassword?.message}
          </ErrorMessage>
        )}
      </FormGroup>
      <FormGroup>
        <Label name="confirmPassword" className="mb-1 text-[15px]">
          New password*
        </Label>
        <Input
          name="confirmPassword"
          placeholder="Type again new password"
          type="password"
          error={errors?.confirmPassword}
          control={control}
        ></Input>
        {errors?.confirmPassword && (
          <ErrorMessage className="-bottom-[2px]">
            {errors.confirmPassword?.message}
          </ErrorMessage>
        )}
      </FormGroup>
      <div className="mb-2 text-center">
        <ButtonGradient
          type="submit"
          isLoading={isSubmitting}
          className={`w-[200px] min-h-[60px] py-3 mt-4 text-base font-bold rounded-md ${
            !isDirty && "pointer-events-none opacity-40"
          }`}
        >
          Update
        </ButtonGradient>
      </div>
    </form>
  );
};

export default SidePassword;
