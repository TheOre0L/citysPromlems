import React, {FC, useContext, useEffect, useState} from 'react';
import {Header} from "./Header/index"
import {Text} from "./text"
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import Footer from "./footer";
import { hot } from 'react-hot-loader/root';
import Post from "./Post/Post";
import {toJS} from "mobx";
import {API_URL} from "../http";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

const Publication : FC = observer( () => {
    const [posts, SetPosts]= useState([])
    const {store} = useContext(Context);
    useEffect(() => {
        document.title = 'Публикации | CITY Problems';
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
        store.getAllPosts()
        SetPosts(toJS(store.allPosts))
    }, []);

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
            {toJS(store.allPosts).map((item:any) => (
                // @ts-ignore
                <Post key={item.id}
                    id={item.id}
                    title={item.title}
                    imageUrl={`${API_URL}${item.image}`}
                    createdAt={'12 июня 2022 г.'}
                    viewCount={item.viewcount}
                    commentsCount={3}
                    tags={[...item.tags]}
                    isEditable = {item.author_id == store.user.id || store.user.role == "ADMIN" ? true : false}
                    store = {store}
                    isLoading = {store.isLoading}
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