import { Link } from "react-router-dom";
import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatarUrl, fullName, href, additionalText}) => {
  return (
    <div className={styles.root}>
      <img className={styles.avatar} style={{objectFit: "cover"}} src={avatarUrl || '/noavatar.png'} alt={fullName} />
      <div className={styles.userDetails}>
        <span className={styles.userName}><Link to={href}>{fullName}</Link></span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
