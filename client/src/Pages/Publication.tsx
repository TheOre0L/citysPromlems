import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';
import Grid from '@mui/material/Grid';
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { useParams } from 'react-router-dom';
import { CLIENT_URL } from "../App";
import { AuthHeader } from "../components/AuthHeader";
import { Header } from "../components/Header";
import CustomizedSnackbars from '../components/Message/notification_msg';
import Post from "../components/Post/Post";
import { PostSkeleton } from "../components/Post/Post/Skeleton";
import Footer from "../components/footer";
import { $api, API_URL } from "../http";
import { Context } from "../index";

const Publication : FC = observer(() => {
    const [posts, SetPosts]= useState([])
    const [search, SetSearch] = useState<string>('');
    const [sortData, SetSortData]= useState<boolean>(false)
    const [sortPopul, SetSortPopul]= useState<boolean>(false)
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
                SetPosts(res.data)
                setIsLoading(false)
            })
        }, []);
    }

    function sortPostsByViews(posts:any){
            SetPosts(posts.sort((a:any, b:any) => b.viewcount - a.viewcount));
        
      }
      function sortPostsByData(posts:any){
        SetPosts(posts.sort((a:any, b:any) => {
            // Преобразование строк даты в объекты Date для сравнения
            const dateA = new Date(a.createdat);
            const dateB = new Date(b.createdat);
            return dateA.getTime() - dateB.getTime();
        }));
  }
  function onSearch(search:string) {
    $api.post("post/search", {search}).then((res) =>{
        SetPosts(res.data)
        setIsLoading(false)
    })
  }
    if(isLoading){
        // @ts-ignore
        return <PostSkeleton/>
    }

    return (

        <div className="container">
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
                            {store.is_message ? <CustomizedSnackbars text={store.message} is_msg = {store.is_message} color={store.color_msg}/>: null}
                <Grid   container spacing={0}>
                <Grid item xs={12}>
                <div className={"container mb-2 w-8/12"}>
                    <label htmlFor="default-search"
                        className="text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">

                        </div>
                        <input type="search" id="default-search"
                            className="block w-full p-3 ps-10 text-sm text-gray-900 border
                                border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500
                                focus:border-blue-500"
                            placeholder="Поиск: "
                            onChange={e => SetSearch(e.target.value)}
                            required/>
                            <button type="button" onClick={() => {onSearch(search)}}
                                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
                                <svg className="w-4 text-white-900 dark:text-white-900" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>

                                </svg>
                            </button>
                    </div>         
                </div>    
                <div className={"container mb-16 w-8/12"}>
                    <div className="relative">
                        <div className="absolute h-10 w-full rounded-lg bg-slate-200 inset-y-0 start-0 flex items-center ps-3">
                        <Chip
                            color={sortData == true ? "danger" : "neutral"}
                            disabled = {sortPopul == true ? true : false}
                            onClick={function(){
                                SetSortData(true)
                                sortPostsByData(posts)
                            }}                            
                            endDecorator={sortData == true ? <ChipDelete onClick = {() => {
                                SetSortData(false)
                                sortPostsByData(posts)
                            }}/> : null}
                            variant="outlined"
                        >Сначала старые</Chip> 
                        <Chip
                            className="ml-2"
                            sx={{
                                wordBreak: "break-all"
                            }}
                            color={sortPopul == true ? "danger" : "neutral"}
                            disabled = {sortData == true ? true : false}
                            onClick={function(){
                                SetSortPopul(true)
                                sortPostsByViews(posts)
                            }}
                            endDecorator={sortPopul == true ? <ChipDelete onClick = {() => {

                                sortPostsByData(posts);
                                SetSortPopul(false);
                            }}/> : null}
                            variant="outlined"
                        >Сначала популярные</Chip> 
                        </div>
                    </div>         
                </div>  
                {toJS(posts).map((item:any) => (
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
                        isEditable={item.author_id == store.user.id || store.user.role == "ADMIN" ? true : false}
                        store={store} children={undefined} isFullPost={false} isLoading={false} isLiked={false} isPreview={false}/>
                        ))}
                </Grid>
              </Grid>
                </>
            
            <Footer/>
                  
        </div>
    );
});

export default hot(Publication);