import React from "react";

import DeleteIcon from "@mui/icons-material/Clear";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import { observer } from "mobx-react-lite";
import { hot } from "react-hot-loader/root";
import { useParams } from "react-router-dom";
import $api, { API_URL } from "../http";
import { SideBlock } from "./SideBlock";

const CommentsBlock = observer(({ items, store, children, isLoading = true }) => {
    const {id} = useParams();
    const DelComments = async (idcomment) => {
        $api.delete(`comment/delete/${idcomment}`)
        window.location.replace(`/post/${id}`)
    }

  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    {isLoading ? (
                        <Skeleton variant="circular" width={40} height={40} />
                    ) : (
                        <Avatar alt={obj.name} src={`${API_URL}${obj.avatarurl}`} />
                    )}
                </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : ( 
                  <>
                      <ListItemText>
                          <a href={`/user/${obj.id}`}>{obj.name}</a> <span style={{fontSize: "10px"}}>{new Date(obj.createdat).toDateString()}</span> <br/>
                          {obj.text}
                      </ListItemText>
                      {obj.id == store.user.id || store.user.role == "ADMIN" ? (
                          <IconButton onClick={() => {DelComments(obj.idcomment)}} color="secondary">
                              <DeleteIcon />
                          </IconButton>
                      ) : (
                          null
                      )
                      }
                  </>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
});
export default hot(CommentsBlock);