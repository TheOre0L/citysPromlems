import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Textarea from '@mui/joy/Textarea';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../..';
import $api from '../../http';
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ComplaintsModal() {
    const {store} = React.useContext(Context);
    const {id} = useParams();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [value, setValue] = React.useState('');
    const [text, setText] = React.useState('');
    const [error, setError] = React.useState(false);
    const [helperText, setHelperText] = React.useState('Choose wisely');
    const handleClose = () => {
        setOpen(false)
        setValue("")
        setError(false)
    };
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setHelperText(' ');
    setError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    $api.post(`complaints/add`, {
        id_post: id,
        id_author: store.user.id,
        text: text,
        type: value,
      })
  };

    return (
        <div>
            <button type="button" onClick={handleOpen} className={"ml-3"}>
                <WarningAmberIcon/>
                Пожаловаться
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" className={""} variant="h6" component="h2">
                        Пожаловаться
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <FormControl sx={{ m: 3 }} error={error} variant="standard">
                            <FormLabel id="demo-error-radios">Выберите тип нарушения</FormLabel>
                            <RadioGroup
                            aria-labelledby="demo-error-radios"
                            name="quiz"
                            value={value}
                            onChange={handleRadioChange}
                            >
                            <FormControlLabel value="Непристойный контент" control={<Radio />} label="Непристойный контент" />
                            <FormControlLabel value="Оскорбления или проявления нетерпимости" control={<Radio />} label="Оскорбления или проявления нетерпимости" />
                            <FormControlLabel value="Вредные или опасные действия" control={<Radio />} label="Вредные или опасные действия" />
                            <FormControlLabel value="Спам или ложная информация" control={<Radio />} label="Спам или ложная информация" />
                            <FormControlLabel value="Пропаганда терроризма" control={<Radio />} label="Пропаганда терроризма" />
                            <FormControlLabel value="Нарушение законодательства" control={<Radio />} label="Нарушение законодательства" />
                            </RadioGroup>
                            <Textarea
                            className="mt-3"
                            color="primary"
                            disabled={false}
                            onChange={(e) => {setText(e.target.value)}}
                            minRows={2}
                            placeholder="Опишите суть нарушения"
                            size="lg"
                            variant="outlined"
                            />
                            <FormHelperText>{helperText}</FormHelperText>
                            <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
                            Отправить жалобу
                            </Button>
                        </FormControl>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}