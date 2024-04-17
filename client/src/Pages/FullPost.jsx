import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { hot } from "react-hot-loader/root";
import Markdown from 'react-markdown';
import { useParams } from "react-router-dom";
import { CLIENT_URL } from "../App";
import { Index } from "../components/AddComment";
import { AuthHeader } from "../components/AuthHeader";
import CommentsBlock from "../components/CommentsBlock";
import { Header } from "../components/Header";
import CustomizedSnackbars from "../components/Message/notification_msg";
import Post from "../components/Post/Post";
import Footer from "../components/footer";
import { $api, API_URL } from "../http";
import { Context } from "../index";


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
            document.title = `Публикация #${id}`
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
    if(!store.isAuth){
        return (
            <>
                <Header/>
                <h2 className={"text-center text-3xl font-mont mt-10"}>
                    <p className={"text-8xl mb-5"}>😥</p>
                    Упс... У вас пока что нет сюда доступа :(
                </h2>
                <h2 className={"text-center font-mont mt-2"}>Войдите в аккаунт или зарегистрируйтесь!</h2>

            </>
        )
    }
  return (
    <>
        {store.isAuth ? <AuthHeader/> : <Header/>}
        {store.is_message ? <CustomizedSnackbars text={store.message} is_msg = {store.is_message} color={store.color_msg}/>: null}
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
        isLiked={data.isLiked}
        isEditable={store.user.role == "ADMIN" || data.post.author_id == store.user.id ? true : false}
        isFullPost
      >
        <Markdown children={data.post.context}/>
      </Post>
        { data.post.comments == true ? 
        <>
                <CommentsBlock
                    items={[...comment]}
                    store={store}
                    isLoading={isLoadingComm}
                >{store.isAuth ?  <>
                    <Index />
                        </> :
                        null
                    }
                </CommentsBlock>
        </> : <>
            <p className="text-center font-mont text-2xl">Комментарии на данном посте были отключены автором!</p>
        </>

        }


        <Footer/>
    </>
  );
});
export default hot(FullPost);
