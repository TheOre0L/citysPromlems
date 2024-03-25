import SaveIcon from "@mui/icons-material/Save";
import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import TabPanel from '@mui/joy/TabPanel';
import Tabs from '@mui/joy/Tabs';
import { Container, Typography } from '@mui/material';
import Button from "@mui/material/Button";
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useRef, useState } from 'react';
import { hot } from "react-hot-loader/root";
import styles from './AddPosts/AddPost.module.scss';
import { AuthHeader } from "../components/AuthHeader";
import { Header } from "../components/Header";
import stylesL from "../components/Login.module.css";
import CustomizedSnackbars from "../components/Message/notification_msg";
import $api, { API_URL } from "../http";
import { Context } from "../index";

const Settings = observer(() => {
    const {store} = useContext(Context);
    const [code, setCode] = useState('')
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
        ).then(res => {
            store.setMsg(true, `${res.data.message}`, "success")
        })
    }

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [remainingTime, setRemainingTime] = useState(120); // 2 минуты в секундах

    useEffect(() => {
        let timer:any = null;

        if (isButtonDisabled) {
            timer = setInterval(() => {
                setRemainingTime((oldRemainingTime) => {
                    if (oldRemainingTime <= 1) {
                        clearInterval(timer);
                        setIsButtonDisabled(false);
                        return 120;
                    }
                    return oldRemainingTime - 1;
                });
            }, 1000); // обновление каждую секунду
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isButtonDisabled]);
    const getActivLink = () => {
        setIsButtonDisabled(true); //
        $api.post(`/api/activate/get`,{
            login: store.user.login,
            email: store.user.email
        }).then(res => {
            
            store.setMsg(true, `${res.data.message}`, "success")
        })

    }    
    const Activate = () => {
        $api.post(`/api/activate`,{
            login: store.user.login,
            code: code
        }).then(res => {
            store.setMsg(true, `${res.data.message}`, "success")
        })
    }
    return (
        <>
            {store.isAuth ? (<AuthHeader/>) : (<Header/>)}
            {store.is_message ? <CustomizedSnackbars text={store.message} is_msg = {store.is_message} color={store.color_msg}/>: null}
            <Tabs
            className="container font-mont"
      aria-label="Vertical tabs"
      orientation="vertical"
      sx={{ minWidth: 300, height: 800 }}
    >
      <TabList>
        <Tab>Основное</Tab>
        <Tab>Активация аккаунта</Tab>
      </TabList>
      <TabPanel value={0}>
      <Paper classes={{root: stylesL.root}}>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
            <button onClick={() => { // @ts-ignore
                inputFileRef.current.click()}}>
                    
                <div className="relative w-20 h-20 overflow-hidden bg-gray-100 mt-0 mb-4 rounded-full dark:bg-gray-600 ml-auto mr-auto" style={{margin: "6em"}}>
                    {imageUrl ? (
                        <>
                        <img className={`flex mt-0 mb-0 w-20 h-20 rounded-2xl`} src={`${API_URL}${imageUrl}`}/>
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
      </TabPanel>
      <TabPanel value={1}>
        {store.user.is_activated ? <>
        <h2 className="text-2xl font-mont text-center mt-96">✅ Вам это уже не нужно :)</h2>
        </> : <>
        <Container className="mt-10 ">
      <div className="flex flex-col items-center">
        <Typography variant="h4" className="mb-2 font-mont">
          Активация аккаунта
        </Typography>
        <Typography variant="body1" className="mb-8 font-mont">
          Пожалуйста, введите код активации отправленный на вашу почту.
        </Typography>
        <TextField
          label="Код активации"
          variant="outlined"
          className="mb-4 w-full max-w-xs"
          onChange={(e:any) => {setCode(e.target.value)}}
        />
        <Button variant="contained" color="primary" onClick={getActivLink} disabled={isButtonDisabled}
            >
                Отправить код
            </Button>
            {isButtonDisabled && (
                <div>Повторная отправка через: {remainingTime} сек.</div>
            )}
        <br/> 
        <Button variant="contained" color="primary" onClick={Activate}>
          Активировать
        </Button>
      </div>
    </Container>
        </>}
      </TabPanel>
      <TabPanel value={2}>
        <b>Third</b> tab panel
      </TabPanel>
    </Tabs>
            
        </>
    );
});

export default hot(Settings);