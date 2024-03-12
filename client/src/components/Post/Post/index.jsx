import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Button from '@mui/joy/Button';
import Tooltip from '@mui/material/Tooltip';
import clsx from 'clsx';
import { useState } from 'react';
import { hot } from "react-hot-loader/root";
import { Link } from "react-router-dom";
import $api from "../../../http";
import ComplaintsModal from "../../ComplaintsModal/ComplaintsModal";
import DeletePost from "../../DeletePost/DeletePostModal";
import BasicModal from "../../ShareModal/ShareModal";
import { UserInfo } from "../../UserInfo";
import styles from './Post.module.scss';
import { PostSkeleton } from './Skeleton';
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
                       children,
                       isFullPost,
                       isLoading,
                       isLiked,
                       isEditable,
                        isPreview
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
                    <Button
                    variant="plain"
                    color="primary"
                    >          
                   <EditIcon className='mr-2'/>
                      Изменить
                  </Button>
              </Link>
                  <Tooltip title="Удалить пост">
                  <DeletePost postId = {id}/>
                  </Tooltip>
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
                      {isPreview ? `#${city_post}`:
                          <Link to={`/posts/${city_post}`}>#{city_post}</Link>
                      }
                  </li>
            </ul>
            {children && <div className={styles.content}>{children}</div>}
            <ul className={styles.postDetails}>
                <li>
                    {isFullPost && !isPreview ?
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
                  {isFullPost && !isPreview  ? <BasicModal/> : null}
                  {isFullPost && !isPreview  ? <ComplaintsModal/> : null}
              </li>
            </ul>
          </div>
        </div>
      </div>
  );
};
export default hot(Post);