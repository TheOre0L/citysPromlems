import React, {useContext, useEffect, useState} from "react";
import Markdown from 'react-markdown'
import Post from "./Post/Post";
import { Index } from "./AddComment";
import CommentsBlock from "./CommentsBlock";
import {Text} from "./text";
import {Header} from "./Header";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {$api, API_URL} from "../http";
import {CLIENT_URL} from "../App";
import {toJS} from "mobx";
import {useParams} from "react-router-dom";
import {hot} from "react-hot-loader/root";


const FullPost = observer(() => {
    const {store} = useContext(Context);
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState()
    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
        $api.post(`post/${id}`, {
            userId: Number(localStorage.getItem("userId"))
        }).then(async (res) => {
            await setData(res.data)
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
        id={data.post.idpost}
        title={data.post.title}
        imageUrl={`${API_URL}${data.post.image}`}
        user={{
            avatarUrl: `${API_URL}${data.author.avatarurl}`,
            fullName: `${data.author.name} ${data.author.surname}`,
            href: `${CLIENT_URL}/user/${data.author.id}`
        }}
        createdAt={data.post.createdat}
        LikeCount={data.post.likes.length}
        viewCount={data.post.viewcount}
        commentsCount={data.post.comments.length}
        tags={[...data.post.tags]}
        isLiked={data.isLiked}
        isFullPost
      >
        <Markdown children={data.post.context}/>
      </Post>
      <CommentsBlock
        items={[...data.post.comments]}
        store={store}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
});
export default hot(FullPost);
