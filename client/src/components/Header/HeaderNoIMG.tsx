import React, {Fragment, useContext, useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import styles from './HeaderNoIMG.module.scss';
import Container from '@mui/material/Container';
import {Context} from "../../index";
import {UserDTO} from "../../models/response/UserDTO";
import {observer} from "mobx-react-lite";
import LoginForm from "../LoginForm";
import {Menu, Transition} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
export const HeaderNoIMG = () => {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<UserDTO[]>([]);

    return (
        <div>
            <div className={styles.root}>
                <Container maxWidth="lg">
                    <div className={styles.inner}>
                        <a className={styles.logo} href="/">
                            <div>
              <span className={"text-3xl caret-amber-600"} style={{color: "#d97706"}}>
                CITY
              </span>
                                <span>
                Problems
              </span>
                            </div>
                        </a>

                        <div>
                           <p>Создание поста</p>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
};
export default observer(HeaderNoIMG);