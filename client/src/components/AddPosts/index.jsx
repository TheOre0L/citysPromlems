import React, {useContext, useEffect, useState, useRef} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {SimpleMdeReact} from 'react-simplemde-editor';
import styles from './AddPost.module.scss';
import {useParams} from "react-router-dom";
import "easymde/dist/easymde.min.css";
import {Context} from "../../index";
import SendIcon from '@mui/icons-material/Send';
import {observer} from "mobx-react-lite";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import {hot} from "react-hot-loader/root";
import {AuthHeader} from "../AuthHeader";
import {Header} from "../Header";
import Errors from "../Errors/errors";
import SaveIcon from '@mui/icons-material/Save';
import {$api, API_URL} from "../../http/index";
import {CLIENT_URL} from "../../App";

const AddPost = observer(() => {
    const {id} = useParams();
    const {store} = useContext(Context);
    const [context, setContext] = React.useState('');
    const [title, setTitle] = useState('')
    const [city, setCity] = useState('')
    const [imageUrl, setimageUrl] = useState('')
    const inputFileRef = useRef(null)
    const handleChangeFile = async (event) => {
        try{
            const formData = new FormData();
            formData.append("image", event.target.files[0])
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
        }).then(res => {
            window.location.replace(`${CLIENT_URL}/post/${id}`)
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
            <div className={styles.buttons}>
                {isEditing ? (
                    <Button size="large" variant="contained" onClick={updatePost}>
                        <SaveIcon/>
                        Сохранить
                    </Button>
                ):(
                    <Button size="large" variant="contained" onClick={handleUpload}>
                        Опубликовать
                        <SendIcon className={"ml-2"}/>
                    </Button>
                )}

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