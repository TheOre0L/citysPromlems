import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useRef, useState } from 'react';
import { hot } from "react-hot-loader/root";
import styles from '../components/AddPosts/AddPost.module.scss';
import { AuthHeader } from "../components/AuthHeader";
import { Header } from "../components/Header";
import stylesL from "../components/Login.module.css";
import $api, { API_URL } from "../http";
import { Context } from "../index";

const Settings = observer(() => {
    const {store} = useContext(Context);
    const [imageUrl, setImageUrl] = useState('')
    const [name, setName] = useState<string>('')
    const [surname, setSurname] = useState<string>('')
    const inputFileRef = useRef(null)
    const handleChangeFile = async (event:any) => {
        try{
            const formData = new FormData();
            const file = event.target.files[0];
            const uniquePrefix = new Date().toISOString().replace(/[-:.]/g,'');
            const uniqueFile = new File([file], `${uniquePrefix}-${file.name}`, { type: file.type });
            formData.append("image", uniqueFile);
            const {data} = await $api.post("/upload", formData);
            setImageUrl(data.url)
        }catch (e) {
            console.log(e)
        }
    };
    useEffect(() => {
        document.title = 'Настройки | CITY Problems';
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
        $api.get(`api/user/${Number(localStorage.getItem("userId"))}`).then((res) => {
            setImageUrl(res.data.user.avatarurl)
            setName(res.data.user.name)
            setSurname(res.data.user.surname)
        })
    }, []);

    const updateUser = () => {
        $api.put(`/api/update`,{
                id: store.user.id,
                name,
                image: imageUrl,
                surname
            }
        )
    }

    return (
        <>
            {store.isAuth ? (<AuthHeader/>) : (<Header/>)}
            <Paper  classes={{ root: stylesL.root }}   >
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
            <button onClick={() => { // @ts-ignore
                inputFileRef.current.click()}}>
                <div className="relative w-20 h-20 overflow-hidden bg-gray-100 mt-0 mb-4 rounded-full dark:bg-gray-600 ml-auto mr-auto" style={{margin: "6em"}}>
                    {imageUrl ? (
                        <>
                        <img className={`flex  mt-0 mb-0 w-20 h-20 rounded-2xl`} src={`${API_URL}${imageUrl}`}/>
                        </>
                    ) : (
                        <>
                            <svg className="absolute w-12/12 text-gray-400 mt-2" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                      clipRule="evenodd"></path>
                            </svg>
                        </>
                    )}
                </div>
            </button> <br/>
                <TextField
                    className={styles.field}
                    onChange={e => setName(e.target.value)}
                    value={name}
                    type="text"
                    placeholder="Имя"
                    fullWidth
                />  <br/>  <br/>
                <TextField
                    className={styles.field}
                    onChange={e => setSurname(e.target.value)}
                    value={surname}
                    type="text"
                    placeholder="Фамилия"
                    fullWidth
                />
                <br/> <br/>
                <Button size="large" variant="contained" onClick={updateUser} fullWidth>
                    <SaveIcon/>
                    Сохранить
                </Button>
            </Paper>
        </>
    );
});

export default hot(Settings);