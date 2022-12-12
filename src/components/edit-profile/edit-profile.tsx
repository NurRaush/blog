import React from "react";
import { Navigate } from "react-router-dom";
import styles from "./edit-profile.module.scss";
import { useForm } from "react-hook-form";
import { fetchEditProfile } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

function EditProfile() {
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
    let newData = {};
    for (let key in data) {
      if (data[key]) {
        newData = { ...newData, [key]: data[key] };
      }
    }
    if (Object.keys(newData).length === 0) {
      return;
    }
    dispatch(fetchEditProfile({ user: newData }));
    reset();
  };
  if (!isAuthorised) {
    return <Navigate replace to="/" />;
  }

  return (
    <>
      {authError && (
        <div className={styles.err}>
          Произошла ошибка на сервере, попробуйте позднее
        </div>
      )}
      <div className={styles.signIn}>
        <span className={styles.title}>Edit profile</span>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <label className={styles.label}>
            Username
            <input
              {...register("username", {
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
            New password
            <input
              {...register("password", {
                minLength: { value: 6, message: "Минимум 6 символов" },
                maxLength: { value: 40, message: "Максимум 40 символов" },
              })}
              className={styles.input}
              type="password"
              placeholder="Password"
            />
          </label>
          <div className={styles.match}>
            {errors?.password && `${errors.password.message}`}
          </div>
          <label className={styles.label}>
            Avatar image (url)
            <input
              {...register("image", {
                pattern: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/

              })}
              className={styles.input}
              type="text"
              placeholder="Avatar image"
            />
          </label>
          <div className={styles.match}>
            {errors?.image && `${errors.image.message}`}
          </div>
          <button className={styles.loginButton} type="submit">
            Save
          </button>
        </form>
      </div>
    </>
  );
}

export default EditProfile;
