import React, {FC, useContext, useEffect, useState} from 'react';
import {Header} from "../components/Header"
import {AuthHeader} from "../components/AuthHeader"
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import Footer from "../components/footer";
import { hot } from 'react-hot-loader/root';
import Post from "../components/Post/Post";
import {toJS} from "mobx";
import {$api, API_URL} from "../http";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import {CLIENT_URL} from "../App";
import {useParams} from "react-router-dom";

const PublicationCity : FC = observer( () => {
    const [posts, SetPosts]= useState([])
    const {store} = useContext(Context);
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        document.title = `Публикации по городу ${id} | CITY Problems`;
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
        $api.get(`post/city/${id}`).then((res) =>{
            console.log(res.data)
            SetPosts(res.data)
            setIsLoading(false)
        })
    }, []);


    if(isLoading){
        // @ts-ignore
        return <Post isLoading={isLoading}/>
    }

    return (

        <>
            {store.isAuth ? (
                <>
                    {/*{console.log(store.isAuth)}*/}
                    <AuthHeader/>
                </>
            ) : (
                <Header/>
            )
            }
            {posts.length == 0 ? <h1 className={"text-center text-3xl font-mont"}>Постов нет :(</h1> : null}
            <>
                <h2 className={"text-center text-3xl font-mont mb-8"}>
                    <h2 className={"text-center  font-mont "}>Публикации с городом {id}</h2>
                </h2>
            </>

            {toJS(posts).map((item:any) => (
                // @ts-ignore
                <Post
                    key={item.idpost}
                    id={item.idpost}
                    title={item.title}
                    imageUrl={`${API_URL}${item.image}`}
                    LikeCount={item.likes.length}
                    city_post={item.city_post}
                    createdAt={item.createdat}
                    user={{
                        avatarUrl: `${API_URL}${item.avatarurl}`,
                        fullName: `${item.name} ${item.surname}`,
                        href: `${CLIENT_URL}/user/${item.id}`
                    }}
                    viewCount={item.viewcount}
                    commentsCount={item.commentcount}
                    isEditable = {item.author_id == store.user.id || store.user.role == "ADMIN" ? true : false}
                    store = {store}
                />
            ))}
            {store.isAuth ?
                <>
                    <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
                        <Fab href={"post/create"} color="primary" aria-label="add">
                            <AddIcon/>
                        </Fab>
                    </Box>
                </> : null
            }

            <Footer/>
        </>
    );
});

export default hot(PublicationCity);