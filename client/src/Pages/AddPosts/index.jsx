import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import Switch, { switchClasses } from '@mui/joy/Switch';
import Typography from '@mui/joy/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import "easymde/dist/easymde.min.css";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { hot } from "react-hot-loader/root";
import { useParams } from "react-router-dom";
import { SimpleMdeReact } from 'react-simplemde-editor';
import { CLIENT_URL } from "../../App";
import { AuthHeader } from "../../components/AuthHeader";
import Errors from "../../components/Errors/errors";
import { Header } from "../../components/Header";
import CustomizedSnackbars from "../../components/Message/notification_msg";
import PreviewPost from "../../components/previewPost/previewPost";
import { $api, API_URL } from "../../http/index";
import { Context } from "../../index";
import styles from './AddPost.module.scss';
const AddPost = observer(() => {
    const {id} = useParams();
    const {store} = useContext(Context);
    const [context, setContext] = React.useState('');
    const [title, setTitle] = useState('')
    const [city, setCity] = useState('')
    const [imageUrl, setimageUrl] = useState('')
    const [checked, setChecked] = useState(true);
    const inputFileRef = useRef(null)
    const handleChangeFile = async (event) => {
        try{
            const formData = new FormData();
            const file = event.target.files[0];
            const uniquePrefix = new Date().toISOString().replace(/[-:.]/g,'');
            const uniqueFile = new File([file], `${uniquePrefix}-${file.name}`, { type: file.type });
            formData.append("image", uniqueFile);
            const {data} = await $api.post("/upload", formData);
            setimageUrl(data.url)
        }catch (e) {
            console.log(e)
        }
    };
    const isEditing = Boolean(id);
    const onClickRemoveImage = () => {
        setimageUrl("")
    };

    const updatePost = async () => {
        $api.put(`/post/update/${id}`, {
            title,
            context,
            city,
            imageUrl,
            comments: checked
        }).then(res => {
            store.setMsg(true, `Пост успешно обновлен, через 3 секунды вы будете перенаправленны на него!`, "success")
            setTimeout(() => {window.location.replace(`${CLIENT_URL}/post/${id}`)}, 3000)
        }).catch((error) => {
            console.log(error)
            alert("При сохранении произошла ошибка")
        })
    }
    const handleUpload = async () => {
        store.createPost(
            title,
            context,
            Number(store.user.id),
            city,
            imageUrl,
            checked
        )
    }

    useEffect(() => {
        document.title = 'Создание поста | CITY Problems';
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
        if(id){
            $api.get(`post/${id}`).then((res) => {
                setTitle(res.data.post.title)
                setContext(res.data.post.context)
                setCity(res.data.post.city_post)
                setimageUrl(res.data.post.image)
                setChecked(res.data.post.comments)
            })

        }
    }, [])

    const onChange = React.useCallback((value) => {
        setContext(value);
    }, []);
    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    );
    if(!store.isAuth){
        return (
            <>
                <Header/>
                <h2 className={"text-center text-3xl font-mont mt-10"}>Упс... У вас пока что нет сюда доступа :(</h2>
                <h2 className={"text-center font-mont mt-2"}>Войдите в аккаунт или зарегистрируйтесь!</h2>

            </>
        )
    }
    return (
    <>
        {store.isAuth ? <AuthHeader/> : <Header/>}
        {store.is_message ? <CustomizedSnackbars text={store.message} is_msg = {store.is_message} color={store.color_msg}/>: null}
        <Paper style={{ padding: 30, width: "90%" }} className={styles.center}>
            <Button onClick={() => {inputFileRef.current.click()}} variant="outlined" size="large">
                <DriveFolderUploadIcon className={"mr-2"}/>
                Загрузить картинку
            </Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
            {imageUrl && (
                <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                    Удалить
                </Button>
            )}
            {imageUrl && (
                <img className={styles.image} src={`${API_URL}${imageUrl}`} alt="Uploaded" />
            )}
            <br />
            <TextField
                classes={{ root: styles.title }}
                value={title}
                onChange={e => setTitle(e.target.value)}
                variant="standard"
                placeholder="Заголовок статьи..."
                fullWidth
            />
            <TextField
                classes={{ root: styles.tags }}
                value={city}
                onChange={e => setCity(e.target.value)}
                variant="standard"
                placeholder="Город..."
                fullWidth />
            <br />
            <SimpleMdeReact className={styles.editor } value={context} onChange={onChange} options={options} />
            <h2 className = "text-center text-2xl font-mont">Настройки</h2>
            <div className='text-2xl font-mont absolute'>
                <Typography component="label" endDecorator={
                    <Switch
                        variant={checked ? 'solid' : 'outlined'}
                        checked={checked}
                        className = "w-10"
                        onChange={(event) => setChecked(event.target.checked)}
                        sx={(theme) => ({
                            display: 'inherit',
                            '--Switch-thumbSize': '14px',
                            '--Switch-thumbShadow': 'inset 0 0 0 1px #dee2e6',
                            '--Switch-trackWidth': '38px',
                            '--Switch-trackHeight': '20px',
                            '--Switch-trackBorderColor': '#dee2e6',
                            '--Switch-trackBackground': '#e9ecef',
                            '--Switch-thumbBackground': '#fff',
                            '&:hover': {
                            '--Switch-thumbBackground': '#fff',
                            '--Switch-trackBackground': '#e9ecef',
                            },
                            [`&.${switchClasses.checked}`]: {
                            '--Switch-thumbShadow': 'none',
                            '--Switch-trackBackground': '#228be6',
                            '&:hover': {
                                '--Switch-trackBackground': '#228be6',
                            },
                            },
                            [`&.${switchClasses.disabled}`]: {
                            '--Switch-thumbColor': '#f8f9fa',
                            '--Switch-trackBackground': '#e9ecef',
                            },
                            [theme.getColorSchemeSelector('dark')]: {
                            '--Switch-trackBorderColor': 'rgb(55, 58, 64)',
                            '--Switch-trackBackground': 'rgb(55, 58, 64)',
                            '--Switch-thumbShadow': 'none',
                            },
                        })}
                        />
                 }>
                    Комментарии к публикации
                </Typography>
            </div>
            <br />
            <br />
            <div className={styles.buttons}>
                {isEditing ? (
                    <Button size="large" variant="contained" onClick={updatePost}>

                        Сохранить
                        <SaveIcon className={"ml-2"}/>
                    </Button>
                ):(
                    <Button size="large" variant="contained" onClick={handleUpload}>
                        Опубликовать
                        <SendIcon className={"ml-2"}/>
                    </Button>
                )}
                <PreviewPost title_view = {title} img_view={imageUrl} city={city} text={context}/>

                <a href="/">
                    <Button size="large">Отмена</Button>
                </a>
            </div>
            <div className='mt-1'>
                {store.is_error ?
                    <Errors message = {store.error}/>
                    :
                    null}
            </div>
        </Paper>
    </>
    );
});
export default hot(AddPost);