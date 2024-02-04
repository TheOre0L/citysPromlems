import React, {useContext, useEffect, useState} from 'react';
import {Header} from "../components/Header"
import {AuthHeader} from "../components/AuthHeader"
import Footer from "../components/footer";
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom"
import {Context} from "../index";
import {UserDTO} from "../models/response/UserDTO";
import Carusel from "../components/carusel/Carusel";
import styles from "../components/Login.module.css"
import {PostSkeleton} from "../components/Post/Post/Skeleton";
import CustomizedSnackbars from "../components/Message/notification_msg";
export const Home = () => {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<UserDTO[]>([]);

    useEffect(() => {
        document.title = 'Главная страница | CITY Problems';
        if (localStorage.getItem('token')) {
            store.checkAuth()

        }

    }, [])
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if(store.isLoading == true) return (<PostSkeleton/>)

    return (
        <div className={"items-stretch"}>
            {store.isAuth ? <AuthHeader/> : <Header/>}
            <div className="container">
                {store.is_message ? <CustomizedSnackbars text={store.message} is_msg = {store.is_message} color={store.color_msg}/>: null}
                <div className="row">
                    <div className={`col-12 align-self-center ${styles.corusel}`}>
                        <Carusel/>
                    </div>
                </div>
            </div>
            <div className="position-absolute top-0 start-50 translate-middle"></div>
            <section className="rounded-2xl relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8 ">


                <div
                    className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20"></div>
                <div
                    className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>
                <div className="mx-auto max-w-2xl lg:max-w-4xl">
                    <div className="grid grid-cols-1 gap-4 place-items-center">
                        <span className="text-center font-bold mx-auto h-12"><span className={"text-center text-3xl text-orange-400 font-bold"}>CITY</span>Problems</span>
                    </div>

                        <figure className="mt-10">
                            <blockquote
                                className=" text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
                                <p>“Мы надеемся, что наш сайт поможет горожанам стать более осведомленными об актуальных
                                    проблемах и найти способы внести свой вклад в их решение. Вместе мы можем создать
                                    лучшее будущее для нашего города и обеспечить комфортные условия жизни для всех его жителей.”</p>
                            </blockquote>
                            <figcaption className="mt-10">
                                    <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                                        <div className="text-gray-600">CEO of Workcation</div>
                                    </div>
                            </figcaption>
                        </figure>
                </div>
            </section>
            <div className="container px-4 py-5" id="hanging-icons">
                <h2 className="pb-2 border-bottom text-2xl">Основные возможности</h2>
                <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
                    <div className="col d-flex align-items-start">
                        <div className="icon-square bg-light text-dark flex-shrink-0 me-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="currentColor"
                                 className="bi bi-plus-square" viewBox="0 0 16 16">
                                <path
                                    d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path
                                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                            </svg>
                        </div>
                        <div>

                            <span className={"text-2xl"}>Создание новостей</span>
                            <p>Вы заметили проблему или вам о ней рассказали? У вас есть возможность "не молчать" и рассказать всем о
                                существовании данной проблемы, старайтесь как можно подробнее её описать.
                            </p>

                        </div>
                    </div>
                    <div className="col d-flex align-items-start ">
                        <div className="icon-square bg-light text-dark flex-shrink-0 me-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="currentColor"
                                 className="bi bi-chat-right-heart" viewBox="0 0 16 16">
                                <path
                                    d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2Zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12Z"/>
                                <path d="M8 3.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z"/>
                            </svg>
                        </div>
                        <div>
                            <span className={"text-2xl"}>Оценивание и комментирование</span>
                            <p>В многих городах, существует множество сложных вопросов, требующих
                                обсуждения и поиска решений. Здесь вы найдете информацию о различных проблемах, с которыми
                                сталкиваются горожане.</p>
                        </div>
                    </div>
                    <div className="col d-flex align-items-start">
                        <div className="icon-square bg-light text-dark flex-shrink-0 me-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="currentColor"
                                 className="bi bi-lightbulb" viewBox="0 0 16 16">
                                <path
                                    d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z"/>
                            </svg>
                        </div>
                        <div>
                            <span className={"text-2xl"}>О платформе</span>
                            <p>Мы стремимся создать платформу, на которой горожане смогут высказать свое мнение,
                                поделиться своими опытом или идеями, а также обсудить важные темы с другими жителями города.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};
export default observer(Home);