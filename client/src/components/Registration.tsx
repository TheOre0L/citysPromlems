import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Link} from "react-router-dom";
import {useContext, useState} from "react";
import {Context} from "../index";
import styles from "./Login.module.css";
import Errors from "./Errors/errors";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from '@mui/material/Box';
import {hot} from "react-hot-loader/root";
import {observer} from "mobx-react-lite";
import Avatar from "@mui/material/Avatar";
import FolderIcon from "@mui/icons-material/Folder";

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

const Registration = observer(() => {
    const [open, setOpen] = React.useState(false);
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [surname, setSurname] = useState<string>('')
    const [city, setCity] = useState<string>('')
    // const [errors, setErrors] = useState<object>({});
    const {store} = useContext(Context)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <button onClick={handleOpen} className="bg-stone-300 text-dark dark:text-white hover:bg-orange-300 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-orange-300 focus:outline-none dark:focus:ring-gray-800">Зарегистрироваться</button>
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
                        Зарегистрировать аккаунт
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
                    <Button className={"hover:accent-amber-700"} style={{backgroundColor: "secondary"}}  onClick={() => store.registration(login, password, name, surname, email, city)} size="large" variant="contained" fullWidth>
                        Зарегистрироваться
                    </Button>
                </Box>
            </Modal>
        </div>
    );
})
export default hot(Registration);