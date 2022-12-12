import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { changePage, setNeedToUpdate } from "../../store/slices/articlesSlice";
import { logOut } from "../../store/slices/authSlice";
import styles from "./header.module.scss";

function Header() {
  const { isAuthorised } = useAppSelector((state) => state.authorization);
  let { username, image } = useAppSelector((state) => state.authorization);
  if (!image) {
    image = "https://static.productionready.io/images/smiley-cyrus.jpg";
  }
  const dispatch = useAppDispatch();
  return (
    <>
      <header className={styles.header}>
        <Link onClick={()=>{dispatch(setNeedToUpdate(true))}} to="/">
          {" "}
          <span className={styles.title}>RealWorld Blog</span>
        </Link>
        {!isAuthorised && (
          <>
            <Link className={styles.signIn} to="/sign-in">
              {" "}
              <button className={styles.signIn} type="button">
                Sign in
              </button>
            </Link>
            <Link to="/sign-up">
              <button className={styles.signUp} type="button">
                Sign up
              </button>
            </Link>
          </>
        )}
        {isAuthorised && (
          <>
            <Link  onClick={() => { changePage(1) }} className={styles.createArticleLink} to="/new-article">
            <button className={styles.createArticle} type="button">
              Create article
            </button>
            </Link>
            <div className={styles.user}>
              <Link to="/profile">
                <span className={styles.username}>{username}</span>
              </Link>
              <img className={styles.avatar} src={`${image}`} alt="User" />
            </div>
            <button
              onClick={() => dispatch(logOut())}
              className={styles.logOut}
              type="button"
            >
              Log out{" "}
            </button>
          </>
        )}
      </header>
      <Outlet />
    </>
  );
}

export default Header;
