import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { CLIENT_URL } from "../App";
import AuthHeader from "../components/AuthHeader";
import Header from "../components/Header";
import CustomizedSnackbars from "../components/Message/notification_msg";
import Post from "../components/Post/Post";
import { PostSkeleton } from "../components/Post/Post/Skeleton";
import Footer from "../components/footer";
import $api, { API_URL } from "../http";
import { Context } from "../index";
const Profile: FC = () => {
    const {store} = useContext(Context);
    const [datas, setData] = useState<any>();
    const [posts, SetPosts]= useState([])
    const [isLoading, setLoading] = useState(true);
    const {id} = useParams();
    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
        $api.get(`api/user/${id}`).then((res) => {
            setData(res.data)
            document.title = `Профиль ${res.data.user.name} ${res.data.user.surname} | CITY Problems`
            $api.get(`post/user/${id}`).then((res) => {
                SetPosts(res.data)
                setLoading(false)
            })
        })
    }, [])


    if(isLoading){
        return <PostSkeleton/>
    }
    return (
        <div>
            {store.is_message ? <CustomizedSnackbars text={store.message} is_msg = {store.is_message} color={store.color_msg}/>: null}
            <div className="pb-12">
            {store.isAuth ? (
                <>
                    <AuthHeader/>
                </>
            ) : (
                <Header/>
            )
            }
            </div>

        
            <div className="w-full lg:w-8/12 px-4 mx-auto">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
                <div className="px-6">
                <div className="flex flex-wrap justify-center">

                    <img alt="..." src={`${API_URL}${datas.user.avatarurl}`} style={{objectFit: "cover"}} width={130} className="shadow-xl  max-w-150-px rounded-full align-middle h-auto border-none -m-16 -ml-20 lg:-ml-16" />
                </div>
                <div className="text-center mt-20">
                    <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700">
                    {datas.user.name} {datas.user.surname}
                    </h3>
                    {datas.user.role == "ADMIN" && store.user.id == datas.user.id ? <Link className="text-orange-400 text-sm" to={"/admin"}>@Администратор</Link> : datas.user.role == "ADMIN" ? <span className="text-orange-400 text-sm" >@Администратор</span> : "@Пользователь"}
                    <div className="text-sm leading-normal mt-3 mb-2 text-blueGray-400 font-bold uppercase">
                    <i className="fas fa-map-marker-alt text-lg text-blueGray-400"></i>
                    {datas.user.city}
                    </div>
                    <div className="mb-1 text-blueGray-600 mt-4">
                    <i className="fas fa-briefcase  text-lg text-blueGray-400"></i>
                    {store.user.id == datas.user.id ? 
                    <>
                        {datas.user.is_activated ? <span className="text-green-700">Аккаунт активирован</span> : <span className="text-red-700">Аккаунт не активирован</span>}
                    </> : null
                    }
                    </div>
                    <div className="w-full px-4 text-center mt-2">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                        <div className="mr-4 p-3 text-center">
                        <span className="text-sm text-blueGray-400">Всего постов: </span>
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            {datas.user.total_posts}
                        </span>
                        
                        </div>
                        <div className="lg:mr-4 p-3 text-center">
                        <span className="text-sm text-blueGray-400">Комментарии: </span>
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {datas.user.total_comments}
                        {console.log(posts)}
                        </span>
                        </div>
                    </div>
                    </div>
                    <span className="text-xl text-blueGray-400">Все посты пользователя </span>
                </div>
                <div className="mt-10 py-10 border-t border-blueGray-200">
                    <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-12/12 px-4">
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
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <Footer/>
        </div>
    );
};

export default observer(Profile);