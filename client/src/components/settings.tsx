import React, {useContext, useEffect} from 'react';
import {Context} from "../index";
import {Text} from "./text";
import {Header} from "./Header";
import {hot} from "react-hot-loader/root";
import {observer} from "mobx-react-lite";

const Settings = observer(() => {
    const {store} = useContext(Context);
    useEffect(() => {
        document.title = 'Настройки | CITY Problems';
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, []);

    return (
        <>
            {store.isAuth ? (<Text/>) : (<Header/>)}

        </>
    );
});

export default hot(Settings);