import Button from '@mui/joy/Button';
import DialogTitle from '@mui/joy/DialogTitle';
import List from '@mui/joy/List';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import * as React from 'react';

import ShareIcon from "@mui/icons-material/Share";
import Form from 'react-bootstrap/Form';
import {
    EmailIcon,
    EmailShareButton,
    MailruIcon,
    MailruShareButton,
    OKIcon,
    OKShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    VKIcon,
    VKShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from "react-share";

export default function BasicModal() {
    const shareUrl = window.location.href
    const [layout, setLayout] = React.useState<any>(undefined);

    return (
        <div>
     <React.Fragment>
        <Stack className='ml-1' direction="row" spacing={1}>
          <Button
            variant="plain"
            className='ml-5'
            color="neutral"
            onClick={() => {
              setLayout('center')
            }}
          >
                <ShareIcon/>
                Поделиться
          </Button>
        </Stack>
        <Modal
          open={!!layout}
          onClose={() => {
            setLayout(undefined);
          }}
        >
          <ModalDialog layout={layout}>
            <ModalClose />
            <DialogTitle>
            <ShareIcon/>
                Поделиться
                </DialogTitle>
            <List
              sx={{
                mx: 'calc(-1 * var(--ModalDialog-padding))',
                px: 'var(--ModalDialog-padding)',
              }}
            >
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
            </List>
          </ModalDialog>
        </Modal>
      </React.Fragment>
        </div>
    );
}