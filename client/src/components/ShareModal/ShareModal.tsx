import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ShareIcon from "@mui/icons-material/Share";
import Form from 'react-bootstrap/Form';
import {
    EmailShareButton,
    MailruShareButton,
    OKShareButton,
    RedditShareButton,
    TelegramShareButton,
    VKShareButton,
    WhatsappShareButton,
    EmailIcon,
    MailruIcon,
    OKIcon,
    RedditIcon,
    TelegramIcon,
    VKIcon,
    WhatsappIcon,
} from "react-share";

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

export default function BasicModal() {
    const shareUrl = window.location.href
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <button type="button" onClick={handleOpen} className={"ml-3"}>
                <ShareIcon/>
                Поделиться
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" className={""} variant="h6" component="h2">
                        Поделиться записью
                    </Typography>
                    <Form.Control className={"mt-2"} type="text" readOnly value={shareUrl} placeholder="Normal text" />
                    <p className={"mt-1"} style={{fontSize: "12px"}} >Скопируйте ссылку или выберите соц-сеть</p>
                    <div className={"mt-3 mb-0"}>
                        <TelegramShareButton url={shareUrl}>
                            <TelegramIcon size={36} round={true}/>
                        </TelegramShareButton>
                        <EmailShareButton className={"ml-1"} url={shareUrl}>
                            <EmailIcon size={36} round={true}/>
                        </EmailShareButton>
                        <MailruShareButton className={"ml-1"} url={shareUrl}>
                            <MailruIcon size={36} round={true}/>
                        </MailruShareButton>
                        <OKShareButton className={"ml-1"} url={shareUrl}>
                            <OKIcon size={36} round={true}/>
                        </OKShareButton>
                        <RedditShareButton className={"ml-1"} url={shareUrl}>
                            <RedditIcon size={36} round={true}/>
                        </RedditShareButton>
                        <VKShareButton className={"ml-1"} url={shareUrl}>
                            <VKIcon size={36} round={true}/>
                        </VKShareButton>
                        <WhatsappShareButton className={"ml-1"} url={shareUrl}>
                            <WhatsappIcon size={36} round={true}/>
                        </WhatsappShareButton>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}