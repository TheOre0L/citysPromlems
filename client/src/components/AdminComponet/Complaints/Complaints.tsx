import Button from '@mui/joy/Button';
import DialogTitle from '@mui/joy/DialogTitle';
import List from '@mui/joy/List';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import { toJS } from 'mobx';
import * as React from 'react';
import Table from 'react-bootstrap/Table';
import $api from '../../../http';

export default function ComplaintsModal(props:any) {
    const [layout, setLayout] = React.useState<any>(undefined);
    const [complaints, SetComplaints]= React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)

    const onClickS = () => {
        $api.get(`complaints/${props.id}`).then((res) =>{
            SetComplaints(res.data)
            setIsLoading(false)
        }).catch((e) => {
            console.log(e)
        });
    }
    return ( 
      <React.Fragment>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="neutral"
            onClick={() => {
              setLayout('center');
              onClickS();
            }}
          >
            Посмотреть жалобы
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
            <DialogTitle>Жалобы</DialogTitle>
            <List
              sx={{
                overflow: 'scroll',
                mx: 'calc(-1 * var(--ModalDialog-padding))',
                px: 'var(--ModalDialog-padding)',
              }}
            >
            <Table aria-label="basic table" className={"mt-3 container"} bordered>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Пост</th>
                            <th>Автор жалобы</th>
                            <th>Тип жалобы</th>
                            <th>Содержание</th>
                            <th>Дата создания</th>
                        </tr>
                        </thead>
                        <tbody>
                        
                        {toJS(complaints).map((item:any) => (
                            <tr key={item.id_complaints}>
                            <td>{item.id_complaints}</td>
                            <td><a href = {`/post/${item.idpost}`}>Ссылка на пост</a></td>
                            <td><a href = {`/user/${item.id_author}`}>Ссылка на автора жалобы</a></td>
                            <td>{item.type}</td>
                            <td>{item.text}</td>
                            <td>{`${item.createdat}`}</td>
                            </tr>
                        ))}

                        
                        </tbody>
            </Table>
            </List>
          </ModalDialog>
        </Modal>
      </React.Fragment>
    );
}