import React, {useContext, useEffect, useState} from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {Context} from "../../index";
import {useParams} from "react-router-dom";
import $api, {API_URL} from "../../http";
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
    $api.post(`comment/add`, {
      author_com_id: store.user.id,
      idpost: id,
      text: commentText
    }).then(window.location.replace(`${CLIENT_URL}/post/${id}`))
  }
  return (
    <>
      <div className={styles.root}>
        <Avatar alt={`${store.user.name} ${store.user.surname}`}
                classes={{ root: styles.avatar }}
                src={`${API_URL}${store.user.avatarurl}`}/>
        <div className={styles.form}>
          <TextField
            placeholder="Написать комментарий"
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
