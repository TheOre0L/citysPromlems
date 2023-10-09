import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import {makeAutoObservable, toJS} from "mobx";
const Profile = () => {
    const {store} = useContext(Context);
    useEffect(() => {

        if (localStorage.getItem('token')) {
           store.getUser(parseInt(window.location.href.split("/")[4]))
        }

    }, [])
    function stringToColor(string: string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }
    function stringAvatar(name: string) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }
    document.title = `Профиль ${store.userR.name} ${store.userR.surname} | CITY Problems`;
    return (
        <div>
            <div className="h-screen bg-gray-200  dark:bg-gray-800   flex flex-wrap items-center  justify-center  ">
                <div
                    className="container lg:w-2/6 xl:w-2/7 sm:w-full md:w-2/3    bg-white  shadow-lg    transform   duration-200 easy-in-out">
                    <div className=" h-16 overflow-hidden">
                    </div>
                    <div className="flex justify-center px-5  -mt-12">
                        <Avatar className="p-2" style={{height: "75px", width: "75px"}} {...stringAvatar(`${store.userR.name} ${store.userR.surname}`)} />
                    </div>
                    <div className=" ">
                        <div className="text-center px-14">
                            <h2 className="text-gray-800 text-3xl font-bold">{`${store.userR.name} ${store.userR.surname}`}</h2>
                            <p className="text-gray-400 mt-2">{`${store.userR.city}`}</p>
                            {
                                store.userR.is_activated ? (<p className="text-gray-400 mt-2">{`Аккаунт активирован`}</p>) : (<p className="text-gray-400 mt-2">{`Аккаунт не активирован`}</p>)
                            }
                            <p className="mt-2 text-gray-600">Lorem Ipsum is simply dummy text of the printing and
                                typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
                                the 1500s, </p>
                        </div>
                        <hr className="mt-6"/>
                        <div className="flex  bg-gray-50 ">
                            <div className="text-center w-1/2 p-4 hover:bg-gray-100 cursor-pointer">
                                <p><span className="font-semibold"></span> Followers</p>
                            </div>
                            <div className="border"></div>
                            <div className="text-center w-1/2 p-4 hover:bg-gray-100 cursor-pointer">
                                <p><span className="font-semibold">2.0 k </span> Following</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default observer(Profile);