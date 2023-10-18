import React, {useContext, useEffect, useState} from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import styles from './Post.module.scss';
import {UserInfo} from "../../UserInfo";
import { PostSkeleton } from './Skeleton';
import {Context} from "../../../index";
import BasicModal from "../../ShareModal/ShareModal";
import $api from "../../../http";
import {observer} from "mobx-react-lite";
import {hot} from "react-hot-loader/root";
import {Link} from "react-router-dom";
const Post = ({
                       id,
                       title,
                       createdAt,
                       imageUrl,
                       user,
                       LikeCount,
                        city_post,
                       viewCount,
                       store,
                       commentsCount,
                       tags,
                       children,
                       isFullPost,
                       isLoading,
                       isLiked,
                       isEditable,
                     }) => {
    const [isLike, setIsLike] = useState(isLiked)
    const [likeCount, setLikeCount] = useState(LikeCount)
  if (isLoading) {
    return <PostSkeleton />;
  }
  const onClickLike = () => {
      $api.post(`post/like/${id}`, {
          id: Number(localStorage.getItem("userId"))
      }).then((res) => {
          setIsLike(res.data.isLiked)
          setLikeCount(res.data.likeCount)
      })
  };

  return (
      <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
        {isEditable && (
            <div className={styles.editButtons}>
              <Link to={`/post/${id}/edit`}>
                  {console.log(id)}
                <IconButton color="primary">
                  <EditIcon />
                </IconButton>
              </Link>
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
            <UserInfo {...user}  additionalText={new Date(createdAt).toDateString()}/>
          <div className={styles.indention}>
            <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
              {isFullPost ? title : <Link to={`/post/${id}`}>{title}</Link>}
            </h2>
            <ul className={styles.tags}>
                  <li key={city_post}>
                    <Link to={`/city/${city_post}`}>#{city_post}</Link>
                  </li>
            </ul>
            {children && <div className={styles.content}>{children}</div>}
            <ul className={styles.postDetails}>
                <li>
                    {isFullPost ?
                        <>
                            <button onClick={onClickLike} className={'flex hover:text-pink-700'}>
                                {isLike ? <FavoriteIcon className={'flex text-pink-700'}/> : <FavoriteBorderIcon className={'flex'}/>}
                            </button>
                            <span>{likeCount}</span>
                        </> :
                        <>
                            <FavoriteBorderIcon className={'flex'}/>
                            <span>{likeCount}</span>
                        </>
                    }
                </li>
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
export default hot(Post);