import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';
import { useContext } from "react";
import { Context } from "../../index";

export default function CustomizedSnackbars(props: any) {
    const [open, setOpen] = React.useState(props.is_msg);
    const {store} = useContext(Context);
    const handleClose = (event:any, reason:any) => {
        if (reason === 'clickaway') {
            return;
        }
        store.setMsg(false, "", "")
        setOpen(false);

    };
    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    // @ts-ignore
                    onClose={handleClose}
                    severity={props.color}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {[...props.text]}
                </Alert>
            </Snackbar>
        </div>
    );
}