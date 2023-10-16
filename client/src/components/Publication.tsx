import React, {FC, useContext, useEffect, useState} from 'react';
import {Header} from "./Header/index"
import {Text} from "./text"
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import Footer from "./footer";
import { hot } from 'react-hot-loader/root';
import Post from "./Post/Post";
import {toJS} from "mobx";
import {$api, API_URL} from "../http";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import {CLIENT_URL} from "../App";

const Publication : FC = observer( () => {
    const [posts, SetPosts]= useState([])
    const {store} = useContext(Context);
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        document.title = 'Публикации | CITY Problems';
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
        $api.get("post/allposts").then((res) =>{
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
                    <Text/>
                </>
            ) : (
                <Header/>
            )
            }
            {posts.length == 0 ? <h1 className={"text-center text-3xl font-mont"}>Постов нет :(</h1> : null}
            {toJS(posts).map((item:any) => (
                // @ts-ignore
                <Post
                    id={item.idpost}
                    title={item.title}
                    imageUrl={`${API_URL}${item.image}`}
                    LikeCount={item.likes.length}
                    createdAt={item.createdat}
                    user={{
                        avatarUrl: `${API_URL}${item.avatarurl}`,
                        fullName: `${item.name} ${item.surname}`,
                        href: `${CLIENT_URL}/user/${item.id}`
                    }}
                    viewCount={item.viewcount}
                    commentsCount={item.comments.length ? item.comments.length : 0}
                    tags={[...item.tags]}
                    isEditable = {item.author_id == store.user.id || store.user.role == "ADMIN" ? true : false}
                    store = {store}
                />
            ))}
            <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
                <Fab href={"post/create"} color="primary" aria-label="add">
                    <AddIcon/>
                </Fab>
            </Box>
            <Footer/>
        </>
    );
});

export default hot(Publication);