import React, {useContext, useEffect, useState} from "react";
import Markdown from 'react-markdown'
import { Post } from "./Post/Post";
import { Index } from "./AddComment";
import { CommentsBlock } from "./CommentsBlock";
import {Text} from "./text";
import {Header} from "./Header";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {$api, API_URL} from "../http";
import {CLIENT_URL} from "../App";
import {toJS} from "mobx";
import {useParams} from "react-router-dom";

export const FullPost = observer(() => {
    const {store} = useContext(Context);
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState()
    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
        $api.get(`post/${id}`).then((res) => {
            setData(res.data)
            setIsLoading(false)
        })
    }, [])

    if(isLoading){
        return <Post isLoading={isLoading}/>
    }

  return (
    <>
        {store.isAuth ? <Text/> : <Header/>}

      <Post
        id={data.post.id}
        title={data.post.title}
        imageUrl={`${API_URL}${data.post.image}`}
        user={{
          avatarUrl:
            "https://res.cloudinary.com/practicaldev/image/fetch/s--uigxYVRB--/c_fill,f_auto,fl_progressive,h_50,q_auto,w_50/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/187971/a5359a24-b652-46be-8898-2c5df32aa6e0.png",
          fullName: `${data.author.name} ${data.author.surname}`,
          href: `${CLIENT_URL}/user/${data.author.id}`
        }}
        createdAt={"12 июня 2022 г."}
        viewCount={data.post.viewcount}
        commentsCount={3}
        tags={[...data.post.tags]}
        isFullPost
      >
        <Markdown children={data.post.context}/>

      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
});
