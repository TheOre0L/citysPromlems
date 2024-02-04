import * as React from 'react';
import Button_Mat from '@mui/material/Button';
import Modal from 'react-bootstrap/Modal';
import {Link} from "react-router-dom";
import {useContext, useState} from "react";
import Box from '@mui/material/Box';
import {hot} from "react-hot-loader/root";
import {observer} from "mobx-react-lite";
import {API_URL} from "../../http";
import {CLIENT_URL} from "../../App";
import Markdown from "react-markdown";
import Post from "../Post/Post";
import Button from 'react-bootstrap/Button';
import {Context} from "../../index";
import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import IconButton from "@mui/material/IconButton";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    "max-height": "80%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const PreviewPost = observer((props:any) => {
    const [open, setOpen] = React.useState(false);
    const {store} = useContext(Context)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // @ts-ignore
    return (
        <div>
            <Button_Mat size="large" variant="contained" onClick={handleOpen}>
                Предпросмотр
                <RemoveRedEyeIcon className={"ml-2"}/>
            </Button_Mat>
            <div className={"row"}>
                <Modal show={open} size="xl"
                       aria-labelledby="example-custom-modal-styling-title"
                       onHide={handleClose} sx={style}
                       dialogClassName="modal-90w"
                >

                    <Modal.Body>
                        <IconButton  className="btn-close bg-stone-400 ml-24" onClick={handleClose} aria-label="Close">
                            <CloseIcon className={"border-black rounded-md hover:bg-red-400 focus:bg-red-400"}></CloseIcon>
                        </IconButton>

                        {    // @ts-ignore}

                        <Post
                            id={1}
                            title={props.title_view}
                            imageUrl={props.img_view ? `${API_URL}${props.img_view}`: `${API_URL}${"/uploads/noimage.png"}`}
                            user={{
                                avatarUrl: `${API_URL}${"/uploads/noimage.png"}`,
                                fullName: `${store.user.name} ${store.user.surname}`,
                                href: `${CLIENT_URL}/user/${store.user.id}`
                            }}
                            createdAt={new Date()}
                            city_post={props.city}
                            LikeCount={0}
                            viewCount={0}
                            commentsCount={0}
                            isLiked={true}
                            isFullPost
                            isPreview={true}
                        >
                            <Markdown children={props.text}/>
                        </Post>
                        }
                    </Modal.Body>

                </Modal>
            </div>
        </div>
    );
})
export default hot(PreviewPost);