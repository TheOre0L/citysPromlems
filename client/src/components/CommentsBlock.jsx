import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import {hot} from "react-hot-loader/root";
import Markdown from "react-markdown";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import {useParams} from "react-router-dom";
import $api, {API_URL} from "../http";

const CommentsBlock = ({ items, store, children, isLoading = true }) => {
    const {id} = useParams();
    const DelComments = async (obj) => {
        $api.delete(`post/comment/delete/${id}`, {
            id_comment: obj.id_comment
        })
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
                        <Avatar alt={obj.user.fullName} src={`${API_URL}${obj.user.avatarUrl}`} />
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
                          {obj.user.fullName} <span style={{fontSize: "10px"}}>{new Date(obj.createdAt).toDateString()}</span> <br/>
                          {obj.text}
                      </ListItemText>
                      {obj.user.id == store.user.id || store.user.role == "ADMIN" ? (
                          <IconButton onClick={() => {DelComments(obj)}} color="secondary">
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
};
export default hot(CommentsBlock);