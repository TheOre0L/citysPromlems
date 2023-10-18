import React from 'react';
import styles from './UserInfo.module.scss';
import {Link} from "react-router-dom";

export const UserInfo = ({ avatarUrl, fullName, href, additionalText}) => {
  return (
    <div className={styles.root}>
      <img className={styles.avatar} src={avatarUrl || '/noavatar.png'} alt={fullName} />
      <div className={styles.userDetails}>
        <span className={styles.userName}><Link to={href}>{fullName}</Link></span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
