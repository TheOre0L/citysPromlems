import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { hot } from "react-hot-loader/root";
import { Link } from "react-router-dom";
import CustomizedSnackbars from "../../components/Message/notification_msg";
import $api from "../../http";
import { Context } from "../../index";
const AdminPanelUser = observer(() => {
    const {store} = useContext(Context);
    const [uid_user, setID] = useState<string>('');
    const [datas, setData] = useState<any>();
    useEffect(() => {
        document.title = 'Админ панель | CITY Problems';
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }

    }, [])

    const Find = (uid:any) => {
        $api.get(`api/user/${uid}`).then((res) => {
            setData(res.data);
        }).catch((e) => {
            console.log(e)
           store.setMsg(true, `${e.response.data.message}`, "error");
        });
    }
    const adminAdd = (uid:any) => {
        $api.put(`admin/add`,
            {
                uid: uid
            }
        ).then((res) => {
            console.log(res.data)
            setData(res.data);
            store.setMsg(true, `${res.data.message}`, "success");
        }).catch((e) => {
            console.log(e)
            store.setMsg(true, `${e.response.data.message}`, "error");
        });
    }
    const adminDelete = (uid:any) => {
        $api.put(`admin/delete`, {uid: uid}).then((res) => {
            setData(res.data);
            store.setMsg(true, `${res.data.message}`, "warning");
        }).catch((e) => {
            console.log(e)
            store.setMsg(true, `${e.response.data.message}`, "error");
        });
    }
    const userBan = (uid:any) => {
        $api.put(`admin/ban`, {uid: uid}).then((res) => {
            setData(res.data);
            store.setMsg(true, `${res.data.message}`, "warning");
        }).catch((e) => {
            console.log(e)
            store.setMsg(true, `${e.response.data.message}`, "error");
        });
    }
    const userUnban = (uid:any) => {
        $api.put(`admin/unban`, {uid: uid}).then((res) => {
            setData(res.data);
            store.setMsg(true, `${res.data.message}`, "warning");
        }).catch((e) => {
            console.log(e)
            store.setMsg(true, `${e.response.data.message}`, "error");
        });
    }
    return (
        <div>
            <div className={"container"}>
                {store.is_message ? <CustomizedSnackbars text={store.message} is_msg = {store.is_message} color={store.color_msg}/>: null}
                <label htmlFor="default-search"
                       className="text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">

                    </div>
                    <input type="search" id="default-search"
                           className="block w-full p-3 ps-10 text-sm text-gray-900 border
                            border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500
                             focus:border-blue-500"
                           placeholder="Введите id пользователя: "
                           onChange={e => setID(e.target.value)}
                           required/>
                        <button type="submit" onClick={() => {Find(uid_user)}}
                                className="text-white absolute end-2.5 bottom-2.5 bg-amber-500 hover:bg-amber-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
                            <svg className="w-4 text-gray-900 dark:text-gray-900" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>

                            </svg>
                        </button>
                </div>

                {datas ?
                <>
                    <Table className={"mt-3"} bordered>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Фамилия</th>
                            <th>E-mail</th>
                            <th>Город</th>
                            <th>Роль</th>
                            <th>Блокировка</th>
                            <th>Ссылка на профиль</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{datas.user.id}</td>
                            <td>{datas.user.name}</td>
                            <td>{datas.user.surname}</td>
                            <td>{datas.user.email}</td>
                            <td>{datas.user.city}</td>
                            <td>{datas.user.role}
                                {datas.user.role == "USER" ?
                                <button type="submit" onClick={() => {adminAdd(uid_user)}}
                                        className="text-white ml-2 end-2.5 bottom-2.5 bg-amber-500 hover:bg-amber-700
                                         focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1">
                                    Назначить администратором
                                </button> :
                                <button type="submit" onClick={() => {adminDelete(uid_user)}}
                                    className="text-white ml-2 end-2.5 bottom-2.5 bg-red-400 hover:bg-red-700
                                    focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1">
                                    Разжаловать
                                </button>
                                }
                            </td>
                            <td>{datas.user.ban}
                                {datas.user.ban == false ?
                                <button type="submit" onClick={() => {userBan(uid_user)}}
                                className="text-white ml-2 end-2.5 bottom-2.5 bg-red-400 hover:bg-red-700
                                focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1">
                                    Забанить
                                </button> :
                                <button type="submit" onClick={() => {userUnban(uid_user)}}
                                    className="text-white ml-2 end-2.5 bottom-2.5 bg-green-400 hover:bg-green-700
                                    focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1">
                                    Разбанить
                                </button>
                                }
                            </td>
                            <td><Link to={`/user/${datas.user.id}`}>Перейти на профиль</Link></td>
                        </tr>
                        </tbody>
                    </Table>
                </> : <>
                        <Table className={"mt-3"} striped bordered hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Имя</th>
                                <th>Фамилия</th>
                                <th>E-mail</th>
                                <th>Город</th>
                                <th>Роль</th>
                                <th>Блокировка</th>
                                <th>Ссылка на профиль</th>
                            </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </Table>
                    </>
                }
            </div>
        </div>
    );
});

export default hot(AdminPanelUser);