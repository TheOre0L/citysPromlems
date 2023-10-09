import {Context} from "../index";
import React, {FC, useContext, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { hot } from 'react-hot-loader/root';
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import FolderIcon from "@mui/icons-material/Folder";
import styles from "./Login.module.css";
import {observer} from "mobx-react-lite";
import Errors from "./Errors/errors";

export const RegistForm: FC = observer(() => {
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [surname, setSurname] = useState<string>('')
    const [city, setCity] = useState<string>('')
    const {store} = useContext(Context)

        useEffect(() => {
            document.title = 'Регистрация | CITY Problems';
        }, [])
    if(store.is_error) console.log(store.error)
    return (
        <>

            <Paper classes={{ root: styles.root }} >
                {store.is_error ? (

                    <Errors message = {store.error}/>
                    )
                    :
                    null}
                <Typography classes={{ root: styles.title }} variant="h5">
                    Зарегистрировать аккаунт
                </Typography>
                <div className="flex items-stretch ml-28 py-3">
                    <Avatar className={"self-center"} style={{width: 70, height: 70}}>
                        <FolderIcon />
                    </Avatar>
                </div>

                <TextField
                    className={styles.field}
                    onChange={e => setLogin(e.target.value)}
                    value={login}
                    type="text"
                    placeholder="Логин"
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    onChange={e => setName(e.target.value)}
                    value={name}
                    type="text"
                    placeholder="Имя"
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    onChange={e => setSurname(e.target.value)}
                    value={surname}
                    type="text"
                    placeholder="Фамилия"
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Эл.почта"
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    onChange={e => setCity(e.target.value)}
                    value={city}
                    type="text"
                    placeholder="Город"
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Пароль"
                    fullWidth
                />
                <Button className={"hover:accent-amber-700"} style={{backgroundColor: "orange"}}  onClick={() => store.registration(login, password, name, surname, email, city)} size="large" variant="contained" fullWidth>
                    Зарегистрироваться
                </Button>
                <h5 className="mt-3 text-center">
                    Уже есть аккаунт? <a href={"/login"}>Войти</a>
                </h5>

            </Paper>
        </>
    );
});

export default hot(RegistForm);