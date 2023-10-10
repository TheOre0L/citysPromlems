import React, {useContext, useEffect, useState} from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {Context} from "../../index";
import {useParams} from "react-router-dom";
import $api from "../../http";
import {CLIENT_URL} from "../../App";

export const Index = () => {
  const [commentText, setCommentText] = useState("")
  const {store} = useContext(Context);
  const {id} = useParams();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  const sendComment = () => {
    $api.post(`post/comment/add/${id}`, {
      id: store.user.id,
      name: store.user.name,
      surname: store.user.surname,
      commentText: commentText
    }).then(window.location.replace(`${CLIENT_URL}/post/${id}`))
  }
  return (
    <>
      <div className={styles.root}>
        <Avatar alt={`${store.user.name} ${store.user.surname}`}
                classes={{ root: styles.avatar }}
                src/>
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button variant="contained" onClick={sendComment}>Отправить</Button>
        </div>
      </div>
    </>
  );
};
