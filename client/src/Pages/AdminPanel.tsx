import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from 'react';
import { hot } from "react-hot-loader/root";
import AdminPanelUser from "../components/AdminComponet/User";
import AdminPanelPost from "../components/AdminComponet/Post";
import { AuthHeader } from "../components/AuthHeader";
import { Header } from "../components/Header";
import Footer from "../components/footer";
import $api from "../http";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Context } from "../index";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  

const AdminPanel = observer(() => {
    const {store} = useContext(Context);
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
  
    useEffect(() => {
        document.title = 'Админ панель | CITY Problems';
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }

    }, [])
    if(store.user.role == "USER" || !store.isAuth){
        document.title = 'Ошибка | CITY Problems';
        return(
            <>
                {store.isAuth ? <AuthHeader/> : <Header/>}
                <h2 className={"text-center text-3xl font-mont mt-10"}>
                    <p className={"text-8xl mb-5"}>⛔</p>
                    Упс... У вас нет сюда доступа :(
                </h2>
                <h2 className={"text-center font-mont mt-2"}>К сожалению вы не имеете доступа к панели администратора,
                    так как, не являетесь администратором!</h2>

            </>
            )
    }

    return (
        <div className={"items-stretch container "}>
            {store.isAuth ? <AuthHeader/> : <Header/>}
            <Box className="text-center" sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Работа с пользователем" {...a11yProps(0)} />
                <Tab label="Работа с постами и жалобами" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
            <AdminPanelUser/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
            <AdminPanelPost/>
            </CustomTabPanel>
            </Box>
            <Footer/>
        </div>
    );
});

export default hot(AdminPanel);