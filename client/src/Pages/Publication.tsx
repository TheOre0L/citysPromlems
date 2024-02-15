import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { useParams } from 'react-router-dom';
import { CLIENT_URL } from "../App";
import { AuthHeader } from "../components/AuthHeader";
import { Header } from "../components/Header";
import Post from "../components/Post/Post";
import { PostSkeleton } from "../components/Post/Post/Skeleton";
import Footer from "../components/footer";
import { $api, API_URL } from "../http";
import { Context } from "../index";

const Publication : FC = observer( () => {
    const [posts, SetPosts]= useState([])
    const {store} = useContext(Context);
    const {city} = useParams();
    const [isLoading, setIsLoading] = useState(true)

    if(city){
        useEffect(() => {
            document.title = `Публикации по городу ${city} | CITY Problems`;
            if (localStorage.getItem('token')) {
                store.checkAuth()
            }
            $api.get(`post/city/${city}`).then((res) =>{
                console.log(res.data)
                SetPosts(res.data)
                setIsLoading(false)
            })
        }, []);
    } else {
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
    }
 
    if(isLoading){
        // @ts-ignore
        return <PostSkeleton/>
    }

    return (

        <>
        { city ? <>
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
            {posts.length == 0 ? <h1 className={"text-center text-3xl font-mont"}>Постов нет :(</h1> :
            <>
                <h2 className={"text-center text-3xl font-mont mb-8"}>
                    <h2 className={"text-center  font-mont "}>Публикации по городу {city}</h2>
                </h2>
            </>}


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
        </> : <>
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
            <Footer/>
        </>}
           
        </>
    );
});

export default hot(Publication);