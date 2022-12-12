import React from "react";
import { Link } from "react-router-dom";
import styles from "./sign-up.module.scss";
import { useForm } from "react-hook-form";
import { fetchSignUp } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

function SignUp() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm({ mode: "onBlur" });

  const dispatch = useAppDispatch();
  const { authError } = useAppSelector((state) => state.authorization);
  const onSubmit = (
    data:
      | {
          username: string;
          email: string;
          password: string;
          confirm_password: string;
          agreement: boolean;
        }
      | any
  ) => {
    dispatch(
      fetchSignUp({
        user: {
          username: data.username,
          email: data.email,
          password: data.password,
        },
      })
    );
    reset();
  };

  return (
    <>
      {authError && (
        <div className={styles.err}>Произошла ошибка, попробуйте еще раз</div>
      )}
      <div className={styles.signUp}>
        <div className={styles.title}>Create a new account</div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <label className={styles.label}>
            Username
            <input
              {...register("username", {
                required: "Поле обязательно к заполнению",
                minLength: { value: 3, message: "Минимум 3 символа" },
                maxLength: { value: 20, message: "Максимум 20 символов" },
              })}
              type="text"
              placeholder="Username"
              className={styles.input}
            />
          </label>
          <div className={styles.match}>
            {errors?.username && `${errors.username.message}`}
          </div>
          <label className={styles.label}>
            Email adress
            <input
              {...register("email", {
                required: "Поле обязательно к заполнению",
                pattern: {
                  value:
                    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                  message: "Некорректный email",
                },
              })}
              type="email"
              placeholder="Email adress"
              className={styles.input}
            />
          </label>
          <div className={styles.match}>
            {errors?.email && `${errors.email.message}`}
          </div>
          <label className={styles.label}>
            Password
            <input
              {...register("password", {
                required: "Поле обязательно к заполнению",
                minLength: { value: 6, message: "Минимум 6 символов" },
                maxLength: { value: 40, message: "Максимум 40 символов" },
              })}
              type="password"
              placeholder="Password"
              className={styles.input}
            />
          </label>
          <div className={styles.match}>
            {errors?.password && `${errors.password.message}`}
          </div>
          <label className={styles.label}>
            Repeat password
            <input
              {...register("confirm_password", {
                required: "Поле обязательно к заполнению",
                minLength: { value: 6, message: "Минимум 6 символов" },
                maxLength: { value: 40, message: "Максимум 40 символов" },
                validate: (val: string) => {
                  if (watch("password") !== val) {
                    return "Пароли не совпадают!";
                  }
                },
              })}
              type="password"
              className={styles.input}
              placeholder="Password"
            />
          </label>
          <div className={styles.match}>
            {errors?.confirm_password && `${errors.confirm_password.message}`}
          </div>
          <label>
            <input
              {...register("agreement", {
                required: "Отметьте,что вы согласны",
              })}
              type="checkbox"
            />
            I agree to the processing of my personal information
          </label>
          <div className={styles.match}>
            {errors?.agreement && `${errors.agreement.message}`}
          </div>
          <button className={styles.createButton} type="submit">
            Create
          </button>
        </form>
        <span className={styles.signIn}>
          Already have an account?{" "}
          <Link className={styles.link} to="/sign-in">
            Sign in
          </Link>
        </span>
      </div>
    </>
  );
}

export default SignUp;
