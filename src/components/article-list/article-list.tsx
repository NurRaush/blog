import React from "react";
import { Pagination, Spin, Tag } from "antd";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchFavorite, setFavorited } from "../../store/slices/articlesSlice";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import styles from "./article-list.module.scss";
import { changePage } from "../../store/slices/articlesSlice";
import { Link } from "react-router-dom";
import { format } from 'date-fns'


function ArticleList() {
  const { articles, articlesCount, page, error, status } = useAppSelector(
    (state) => state.articles
  );
  const {isAuthorised} = useAppSelector((state)=>state.authorization)
  const dispatch = useAppDispatch();
  const list = articles.map((elem,index) => {
    const tagList = elem.tagList.map((elem) => <Tag>{elem}</Tag>);
    const created = elem.createdAt?.slice(0, 10)
    let date: Date = new Date();
    if (typeof created === 'string') {
      date =new Date(created)  
    }
    return (
      <div key={elem.slug} className={styles.article}>
        <div className={styles.header}>
          <Link  to={`/articles/${elem.slug}`}>
            <span className={styles.title}>{elem.title}</span>{" "}
          </Link>
          {elem.favorited && <HeartFilled className={styles.heart} onClick={() => {
            if (isAuthorised) {
              dispatch(fetchFavorite({ method: "DELETE", slug: elem.slug }))
              dispatch(setFavorited(index))
            }
          }} />} 
          {!elem.favorited && <HeartOutlined className={styles.heart} onClick={() => {
            if (isAuthorised) {
              dispatch(fetchFavorite({ method: "POST", slug: elem.slug }))
              dispatch(setFavorited(index))
            }
          }} />}
          <span className={styles.count}>{elem.favoritesCount}</span>
          <div className={styles.author}>
            <div className={styles.info}>
              <span className={styles.name}>{elem.author.username}</span>
              <span className={styles.date}>{format(date,'MMMM d, yyyy')}</span>
            </div>
            <img
              className={styles.avatar}
              src={`${elem.author.image}`}
              alt="Avatar"
            />
          </div>
        </div>
        <div className={styles.tagList}>{tagList}</div>
        <div className={styles.description}>{elem.description}</div>
      </div>
    );
  });
  return (
    <>
      {error && (
        <div>К сожалению данные не удалось загрузить. Обновите страницу.</div>
      )}
      {status === "loading" && (
        <div className={styles.spinner}>
          <Spin size="large" />
        </div>
      )}
      {!error && status === "done" && (
        <div className={styles.articlelList}>
          {list}
          <div className={styles.pagination}>
            <Pagination
              defaultCurrent={1}
              total={articlesCount}
              defaultPageSize={5}
              hideOnSinglePage
              current={page}
              onChange={(page) => {
                dispatch(changePage(page));
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ArticleList;
