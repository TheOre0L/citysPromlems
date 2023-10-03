    import {Context} from "../index";
    import React, {FC, useContext, useState, useEffect} from "react";
    import Typography from "@mui/material/Typography";
    import TextField from "@mui/material/TextField";
    import Paper from "@mui/material/Paper";
    import Button from "@mui/material/Button";

    import styles from "./Login.module.css";

    export const LoginForm: FC = () => {
        const [login, setLogin] = useState<string>('')
        const [password, setPassword] = useState<string>('')
        const {store} = useContext(Context)
        useEffect(() => {
            document.title = 'Вход в аккаунт | CITY Problems';
        }, []);
        return (
            <Paper classes={{ root: styles.root }} className={"bg-stone-200"}>
                <Typography classes={{ root: styles.title }} variant="h5">
                    Вход в аккаунт
                </Typography>
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
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Пароль"
                    fullWidth
                />
                <Button onClick={() => store.login(login, password)} size="large" variant="contained" fullWidth>
                    Войти
                </Button>
                <h5 className="mt-5">
                    Ещё нет аккаунта? <a href={"/registration"}>Зарегистрироваться</a>
                </h5>
            </Paper>
        );
    };

export default LoginForm;