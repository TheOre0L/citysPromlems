import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
const Errors = (props: any) => {
    const [open, setOpen] = React.useState(true);

    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="error">
                    {[...props.message]}
                </Alert>
            </Stack>
        </div>
    );
};

export default Errors;