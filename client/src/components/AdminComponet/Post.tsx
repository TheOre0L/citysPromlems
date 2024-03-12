import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import { toJS } from 'mobx';
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { hot } from "react-hot-loader/root";
import { Link } from "react-router-dom";
import CustomizedSnackbars from "../../components/Message/notification_msg";
import $api, { API_URL } from "../../http";
import { Context } from "../../index";
import ComplaintsModal from '../AdminComponet/Complaints/Complaints';
import DeletePost from "../DeletePost/DeletePostModal";
import { PostSkeleton } from '../Post/Post/Skeleton';
const AdminPanelPost = observer(() => {
    const {store} = useContext(Context);
    const [posts, SetPosts]= useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        $api.get("post/allposts").then((res) =>{
            SetPosts(res.data)
            setIsLoading(false)
        }).catch((e) => {
            console.log(e)
           store.setMsg(true, `${e.response.data.message}`, "error");
        });
    }, [])
    if(store.isLoading == true) return (<PostSkeleton/>)
    return (
        <div>
            <div className={"container"}>
                {store.is_message ? <CustomizedSnackbars text={store.message} is_msg = {store.is_message} color={store.color_msg}/>: null}
                {posts ?
                <>
                    <Table aria-label="basic table" className={"mt-3 container"} bordered>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Изображение</th>
                            <th>Заголовок</th>
                            <th>Город</th>
                            <th>Жалобы</th>
                            <th>Ссылка на пост</th>
                            <th>Действия с постом</th>
                            <th>Ссылка на автора</th>
                        </tr>
                        </thead>
                        <tbody>
                        
                        {toJS(posts).map((item:any) => (
                            <tr key={item.idpost}>
                            <td>{item.idpost}</td>
                            <td><img src={`${API_URL}${item.image}`} width={250}></img></td>
                            <td>{item.title}</td>
                            <td>{item.city_post}</td>
                            <td>
                                <ComplaintsModal id = {`${item.idpost}`}/>
                            </td>
                            <td><Link to={`/post/${item.idpost}`}>Перейти на профиль</Link></td>
                            <td>
                            <ButtonGroup>
                            <DeletePost postId = {item.idpost}></DeletePost>
                            <Link to={`/post/${item.idpost}/edit`}>
                                <Tooltip title="Изменить пост">
                                <Button
                                    variant="plain"
                                    color="primary"
                                >
                                    
                                            <EditIcon className='mr-2'/>
                                            Изменить
                                </Button>
                                </Tooltip>
                            </Link>
                                </ButtonGroup>
                            
                            </td>
                            <td><Link to={`/user/${item.author_id}`}>Перейти на профиль</Link></td>
                            </tr>
                        ))}

                        
                        </tbody>
                    </Table>
                </> : <>
                        <Table className={"mt-3"} striped bordered hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Заголовок</th>
                                <th>Контекст</th>
                                <th>Город</th>
                                <th>Жалобы</th>
                                <th>Действия с постом</th>
                                <th>Ссылка на автора</th>
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

export default hot(AdminPanelPost);