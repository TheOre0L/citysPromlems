    import {Context} from "../index";
    import React, {FC, useContext, useState, useEffect} from "react";
    import Typography from "@mui/material/Typography";
    import TextField from "@mui/material/TextField";
    import Paper from "@mui/material/Paper";
    import Button from "@mui/material/Button";
    import { hot } from 'react-hot-loader/root';
    import styles from "./Login.module.css";
    import Errors from "./Errors/errors";
    import {observer} from "mobx-react-lite";

    export const LoginForm: FC = observer(() => {
        const [login, setLogin] = useState<string>('')
        const [password, setPassword] = useState<string>('')
        // const [errors, setErrors] = useState<object>({});
        const {store} = useContext(Context)
        // useEffect(() => {
        //     document.title = 'Вход в аккаунт | CITY Problems';
        //     //setErrors(localStorage.getItem("error"))
        // }, []);
        //if(store.is_error) console.log(store.error);
        return (
            <Paper classes={{ root: styles.root }} className={"bg-stone-200"}>

                {store.is_error ?
                    <Errors message = {store.error}/>
                    :
                    null}
                <Typography classes={{ root: styles.title }} variant="h5">
                    Вход в аккаунт
                </Typography>
                <TextField
                    className={styles.field}
                    label="Логин"
                    onChange={e => setLogin(e.target.value)}
                    value={login}
                    type={"text"}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    type={"password"}
                    label="Пароль"
                    required={true}
                    fullWidth
                />
                <Button onClick={() => store.login(login, password)} style={{backgroundColor: "orange"}} size="large" variant="contained" fullWidth>
                    Войти
                </Button>
                <h5 className="mt-5">
                    Ещё нет аккаунта? <a href={"/registration"}>Зарегистрироваться</a>
                </h5>
            </Paper>
        );
    });

export default hot(LoginForm);