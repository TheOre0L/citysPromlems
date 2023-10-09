import React, {useContext} from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ShareIcon from '@mui/icons-material/Share';
import styles from './Post.module.scss';
import {UserInfo} from "../../UserInfo";
import { PostSkeleton } from './Skeleton';
import {Context} from "../../../index";
import BasicModal from "../../ShareModal/ShareModal";

export const Post = ({
                       id,
                       title,
                       createdAt,
                       imageUrl,
                       user,
                       LikeCount,
                       viewCount,
                       store,
                       commentsCount,
                       tags,
                       children,
                       isFullPost,
                       isLoading,
                       isEditable,
                     }) => {
  if (isLoading) {
    return <PostSkeleton />;
  }
  const onClickRemove = () => {

  };

  return (
      <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
        {isEditable && (
            <div className={styles.editButtons}>
              <a href={`/post/${id}/edit`}>
                <IconButton color="primary">
                  <EditIcon />
                </IconButton>
              </a>
              <IconButton onClick={() => {store.deletePost(id)}} color="secondary">
                <DeleteIcon />
              </IconButton>
            </div>
        )}
        {imageUrl && (
            <img
                className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
                src={`${imageUrl}`}
                alt={title}
            />
        )}
        <div className={styles.wrapper}>
            {isFullPost ? <UserInfo {...user} /> : null}
          <div className={styles.indention}>
            <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
              {isFullPost ? title : <a href={`/post/${id}`}>{title}</a>}
            </h2>
            <ul className={styles.tags}>
              {tags.map((name) => (
                  <li key={name}>
                    <a href={`/tag/${name}`}>#{name}</a>
                  </li>
              ))}
            </ul>
            {children && <div className={styles.content}>{children}</div>}
            <ul className={styles.postDetails}>
              <li>
                <EyeIcon />
                <span>{viewCount}</span>
              </li>
              <li>
                <CommentIcon />
                <span>{commentsCount}</span>
                  {isFullPost ? <BasicModal/> : null}
              </li>
            </ul>
          </div>
        </div>
      </div>
  );
};
