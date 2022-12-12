import React, { FC, useEffect, useState } from "react";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Tag, Spin } from "antd";
import ReactMarkdown from "react-markdown";
import styles from "./article.module.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Link, useParams } from "react-router-dom";
import {
  fetchDeleteArticle,
  fetchFavorite,
  fetchFullArticle,
  setFavoritedFull,
  unmountArticle,
} from "../../store/slices/articlesSlice";

const FullArticle: FC = () => {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const article = useAppSelector((state) => state.articles.fullArticle);
  const {isAuthorised} = useAppSelector((state)=>state.authorization)
  let [isFetchDone,setIsFetchDone] = useState(false)
  let [isDelete, setIsDelete] = useState<boolean>(false);
  const isAuthor = localStorage.getItem("username") === article.author.username
  useEffect(() => {
    if (slug) {
      dispatch(fetchFullArticle(slug));
    }
    return () => {
      dispatch(unmountArticle());
    };
  }, [slug, dispatch]);
  if (!article) {
    return (
      <div className={styles.spinner}>
        <Spin size="large" />
      </div>
    );
  }
  const tagList = article.tagList
    ? article.tagList.map((elem) => <Tag key={`${elem}`}>{elem}</Tag>)
    : null;

  if (isFetchDone) {
    return <div className={styles.pageDeleted}>Страница удалена </div>
  }
  return (
    <div className={styles.article}>
      <div className={styles.header}>
        <h2 className={styles.title}>{article.title}</h2>
        {article.favorited && <HeartFilled className={styles.heart} onClick={() => {
          if (isAuthorised) {
            dispatch(fetchFavorite({ method: "DELETE", slug: article.slug }))
            dispatch(setFavoritedFull())
          }
          }} />} 
        {!article.favorited && <HeartOutlined className={styles.heart} onClick={() => {
          if (isAuthorised) {
            dispatch(fetchFavorite({ method: "POST", slug: article.slug }))
            dispatch(setFavoritedFull())
          }
            }} />}
        <span className={styles.count}>{article.favoritesCount}</span>
        <div className={styles.author}>
          <div className={styles.info}>
            <span className={styles.name}>{article.author.username}</span>
            <span className={styles.date}>{article.updatedAt}</span>
          </div>
          <img
            className={styles.avatar}
            src={`${article.author.image}`}
            alt="Avatar"
          />
        </div>
      </div>
      <div className={styles.tagList}>{tagList}</div>
      <div className={styles.descriptionContainer}>
        <div className={styles.description}>{article.description}</div>
       {isAuthor && <> <button className={styles.deleteButton} type="button" onClick={()=>{setIsDelete(true)}}>Delete</button>
        {isDelete && <div className={styles.deleteModal}><div className={styles.modalInner}>Are you sure to delete this article?</div>
          <button className={styles.modalNo} onClick={()=>{setIsDelete(false)}}>No</button>
          <button className={styles.modalYes} onClick={() => {
            if (typeof slug === 'string') {
              dispatch(fetchDeleteArticle(slug))
              setIsFetchDone(true)
            }
          }}>Yes</button>
        </div>}
        <Link to={`/articles/${slug}/edit`}> <button className={styles.editButton} type="button">Edit</button></Link> </>}
      </div>
        <div className={styles.main}>
        <ReactMarkdown>{article.body?article.body:''}</ReactMarkdown>
      </div>
    </div>
  );
};

export default FullArticle;
