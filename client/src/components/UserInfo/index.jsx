import React from 'react';
import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatarUrl, fullName, href}) => {
  return (
    <div className={styles.root}>
      <img className={styles.avatar} src={avatarUrl || '/noavatar.png'} alt={fullName} />
      <div className={styles.userDetails}>
        <span className={styles.userName}><a href={href}>{fullName}</a></span>
        {/*<span className={styles.additional}>{additionalText}</span>*/}
      </div>
    </div>
  );
};
