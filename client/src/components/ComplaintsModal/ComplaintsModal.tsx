import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Button from '@mui/joy/Button';
import DialogTitle from '@mui/joy/DialogTitle';
import List from '@mui/joy/List';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Textarea from '@mui/joy/Textarea';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../..';
import $api from '../../http';

export default function ComplaintsModal() {
    const {store} = React.useContext(Context);
    const {id} = useParams();
    const [layout, setLayout] = React.useState<any>(undefined);
    const [value, setValue] = React.useState('');
    const [text, setText] = React.useState('');
    const [error, setError] = React.useState(false);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    $api.post(`complaints/add`, {
        id_post: id,
        id_author: store.user.id,
        text: text,
        type: value,
      }).then((response) => {
        store.setMsg(true, `${response.data.message}`, "success");
      })
      .catch((e) => {
       store.setMsg(true, `${e.response.data.message}`, "error");
    });
  };

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
                            <WarningAmberIcon/>
                Пожаловаться
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
            <WarningAmberIcon/>
                Пожаловаться
                </DialogTitle>
            <List
              sx={{
                mx: 'calc(-1 * var(--ModalDialog-padding))',
                px: 'var(--ModalDialog-padding)',
              }}
            >
                <form onSubmit={handleSubmit}>
                        <FormControl sx={{ m: 3 }} error={error} variant="standard">
                            <FormLabel id="demo-error-radios">Выберите тип нарушения</FormLabel>
                            <RadioGroup
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
                            <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
                            Отправить жалобу
                            </Button>
                        </FormControl>
                    </form>
            </List>
          </ModalDialog>
        </Modal>
      </React.Fragment>
        </div>
    );
}