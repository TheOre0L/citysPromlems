import DeleteIcon from '@mui/icons-material/Delete';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import Button from '@mui/joy/Button';
import DialogActions from '@mui/joy/DialogActions';
import DialogContent from '@mui/joy/DialogContent';
import DialogTitle from '@mui/joy/DialogTitle';
import Divider from '@mui/joy/Divider';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import * as React from 'react';
import { Context } from "../../index";
export default function DeletePost(props:any) {
    const {store} = React.useContext(Context);
    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <div>
     <React.Fragment>
        <Stack className='w-100' direction="row" spacing={1}>
          <Button
            variant="plain"
            color="danger"
            className='w-100'
            onClick={() => setOpen(true)}
          >
            
                    <DeleteIcon className='mr-2'/>
                    Удалить
          </Button>
        </Stack>
        <Modal
        open={open}
         onClose={() => setOpen(false)}
        >
          <ModalDialog variant="outlined" role="alertdialog">
            <ModalClose/>
          <DialogTitle>
            <WarningRoundedIcon />
            Внимание
          </DialogTitle>
          <Divider />
          <DialogContent>
            Вы уверены что хотите удалить пост #{props.postId}?
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={() => {
                setOpen(false);
                store.deletePost(props.postId);
            }}>
              Удалить пост
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
              Отмена
            </Button>
          </DialogActions>
        </ModalDialog>
        </Modal>
      </React.Fragment>
        </div>
    );
}