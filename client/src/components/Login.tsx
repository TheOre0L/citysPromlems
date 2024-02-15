import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import { observer } from "mobx-react-lite";
import * as React from 'react';
import { useContext, useState } from "react";
import { hot } from "react-hot-loader/root";
import { Context } from "../index";
import Errors from "./Errors/errors";
import styles from "./Login.module.css";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const BasicModal = observer(() => {
    const [open, setOpen] = React.useState(false);
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    // const [errors, setErrors] = useState<object>({});
    const {store} = useContext(Context)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <button onClick={handleOpen} className="bg-stone-300 text-dark dark:text-white hover:bg-orange-300 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-orange-300 focus:outline-none dark:focus:ring-gray-800">Войти</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
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
                    <Button onClick={() => store.login(login, password)} style={{backgroundColor: "secondary"}} size="large" variant="contained" fullWidth>
                        Войти
                    </Button>
                </Box>
            </Modal>
        </div>
    );
})
export default hot(BasicModal);