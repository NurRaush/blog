import React from "react";
import { Link, Navigate } from "react-router-dom";
import styles from "./sign-in.module.scss";
import { useForm } from "react-hook-form";
import { fetchSignIn } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

function SignIn() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ mode: "onBlur" });
  const dispatch = useAppDispatch();
  const { isAuthorised, authError } = useAppSelector(
    (state) => state.authorization
  );

  const onSubmit = (data: { email: string; password: string } | any) => {
    dispatch(fetchSignIn({ user: data }));
    reset();
  };
  if (isAuthorised) {
    return <Navigate replace to="/" />;
  }

  return (
    <>
      {authError && (
        <div className={styles.err}>Неверные логин и/или пароль</div>
      )}
      <div className={styles.signIn}>
        <span className={styles.title}>Sign In</span>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <label className={styles.label}>
            Email adress
            <input
              {...register("email", {
                required: "Поле обязательно к заполнению",
                pattern:
                  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                minLength: { value: 1, message: "Не должен быть пустым" },
              })}
              className={styles.input}
              type="email"
              placeholder="Email adress"
            />
          </label>
          <div className={styles.match}>
            {errors?.email && `${errors.email.message}`}
          </div>
          <label className={styles.label}>
            Password
            <input
              {...register("password", {
                minLength: { value: 1, message: "Не должен быть пустым" },
              })}
              className={styles.input}
              type="password"
              placeholder="Password"
            />
          </label>
          <div className={styles.match}>
            {errors?.password && `${errors.password.message}`}
          </div>
          <button className={styles.loginButton} type="submit">
            Login
          </button>
        </form>
        <div className={styles.signUp}>
          Don't have an account?{" "}
          <Link className={styles.link} to="/sign-up">
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
}

export default SignIn;
