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
    const [isLoadingComm, setIsLoadingComm] = useState(true)
    const [data, setData] = useState()
    const [comment, setComment] = useState()
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
        $api.post(`comment/all`, {
            idpost: id
        }).then(res => {
            setComment(res.data)
            setIsLoadingComm(false)
        })
    }, [])

    if(isLoading || isLoadingComm){
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
            avatarUrl: `${API_URL}${data.post.avatarurl}`,
            fullName: `${data.post.name} ${data.post.surname}`,
            href: `${CLIENT_URL}/user/${data.post.id}`
        }}
        createdAt={data.post.createdat}
        city_post={data.post.city_post}
        LikeCount={data.post.likes.length}
        viewCount={data.post.viewcount}
        commentsCount={data.post.count}
        tags={[...data.post.tags]}
        isLiked={data.isLiked}
        isFullPost
      >
        <Markdown children={data.post.context}/>
      </Post>
        {console.log([...comment])}
      <CommentsBlock
        items={[...comment]}
        store={store}
        isLoading={isLoadingComm}
      >
        <Index />
      </CommentsBlock>
    </>
  );
});
export default hot(FullPost);
