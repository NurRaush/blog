import React, { useState, useEffect } from 'react'
import {useFieldArray ,useForm } from 'react-hook-form';
import { Navigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchEditArticle, fetchFullArticle, fetchNewArticle, setNeedToUpdate, unmountArticle } from '../../store/slices/articlesSlice';
import styles from './create-article.module.scss'

function CreateArticle(props: { articleType: string }) {
  const [tagField, setTagField] = useState<string>('');
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control
  } = useForm({ mode: "onBlur" });
  const {fields, append, remove} = useFieldArray({control,name:"tagList"})
  const dispatch = useAppDispatch();
  const { articleType } = props
  const isEdit = articleType === 'edit' ? true : false;
  const {slug} = useParams()
  const article = useAppSelector((state) => state.articles.fullArticle);
  const {isAuthorised} = useAppSelector((state)=>state.authorization)
  let isFetchDone = false;
  
  useEffect(() => {
    if (isEdit) {
      article.tagList.map(elem => {
        append(elem)
        return elem
      })
      if (typeof slug === 'string') {
        fetchFullArticle(slug)  
      }
    }
    return ()=>{dispatch(unmountArticle())}
  }, [])

  if (!isAuthorised) {
    return <Navigate to="/sign-in"/>
  }
  
  if (isFetchDone) {
    setNeedToUpdate(true)
    return (<Navigate to="/"/>)
  }

  const onCreateSubmit = (data: { title: string, description: string, body: string, tags?: string }| any) => {
    if (!isEdit) {
      dispatch(fetchNewArticle(data))  
    } else {
      if (typeof slug === 'string') { 
        dispatch(fetchEditArticle({slug,data}))
      }
    }
    reset()
    isFetchDone=true
  }

  return (
    <div className={styles.createArticle}>
      {!isEdit && <h2 className={styles.title}>Create a new article</h2>}
      {isEdit && <h2 className={styles.title}>Edit article</h2>} 
      <form className={styles.form} onSubmit={handleSubmit(onCreateSubmit)}>
        <label className={styles.label}>
          Title
          <input defaultValue={article.title?article.title:''} className={styles.input} {...register("title", {
            required: "Поле обязательно для заполнения",
            minLength:1
          })} type="text" placeholder="Title" />
        </label>
        <div className={styles.match}>
            {errors?.title && `${errors.title.message}`}
          </div>
        <label className={styles.label}>
          Short description
          <input className={styles.input} defaultValue={article.description ? article.description : ''} {...register("description", {
            required: "Поле обязательно для заполнения",
            minLength:1
          })} type="text" placeholder="Short description" />
        </label>
        <div className={styles.match}>
            {errors?.description && `${errors.description.message}`}
          </div>
        <label className={styles.label}>
          Text
          <textarea className={styles.input} defaultValue={article.body ? article.body : ''} {...register("body", {
            required: "Поле обязательно для заполнения",
            minLength:1
          })} placeholder="Text" />
        </label>
        <div className={styles.match}>
            {errors?.body && `${errors.body.message}`}
          </div>
        {fields.map((field, index) => {
          return (<section key={field.id}>
          <input className={styles.tagInput}  {...register(`tagList.${index}`)}  />
          <button className={styles.deleteButton} onClick={()=>{remove(index)}}>Delete</button>
          </section>)
        })}
        <div className={styles.addTagContainer}>
        <input className={styles.tagInput} value={tagField}  minLength={1} onChange={(e)=>{setTagField(e.target.value)}} />
          <button className={styles.addButton} type="button" onClick={() => {
          const val = tagField
          append(val)
          setTagField('')
          }} >Add tag</button>
          </div>
        <button className={styles.sendButton} type="submit" >Send</button>
      </form>
    </div>
  )
}

export default CreateArticle
