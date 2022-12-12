import React from "react";
import { useEffect } from "react";
import { fetchArticles, setNeedToUpdate } from "../../store/slices/articlesSlice";
import ArticleList from "../article-list";
import Header from "../header";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import FullArticle from "../article/article";
import { Route, Routes } from "react-router-dom";
import SignIn from "../sign-in";
import SignUp from "../sign-up";
import { autoAuthorise, fetchSignIn } from "../../store/slices/authSlice";
import EditProfile from "../edit-profile";
import CreateArticle from "../create-article";
 
function App() {
  const { page,needToUpdate,  } = useAppSelector((state) => state.articles);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(fetchArticles(page))
  }, [page, dispatch]);

  useEffect(() => {
    if (needToUpdate) {
      dispatch(fetchArticles(page));
      dispatch(setNeedToUpdate(false))
    }
  },[needToUpdate,page,dispatch])
  useEffect(() => {
    if (localStorage.getItem("email") && localStorage.getItem("password")) {
      const password = localStorage.getItem("password");
      const email = localStorage.getItem("email");
      autoAuthorise();
      if (typeof email === "string" && typeof password === "string") {
        dispatch(fetchSignIn({ user: { email, password } }));
      }
    }
  }, [dispatch]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<ArticleList />} />
          <Route path="/articles" element={<ArticleList />} />
          <Route path="/articles/:slug" element={<FullArticle />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/new-article" element={<CreateArticle articleType={"create"}/>} />
          <Route path="articles/:slug/edit" element={<CreateArticle articleType={"edit"} />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
