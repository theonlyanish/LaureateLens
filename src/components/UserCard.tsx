import { User } from '../services/api';
import { formatPhoneNumber } from '../utils/formatPhoneNumber';
import styles from '../styles/UserCard.module.css';

// component props
interface UserCardProps {
  user: User;
}

// User card component for displaying user information
const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className={styles['user-card']}>
      <h3>{user.name}</h3>
      <p>
        <span className={styles.icon}>📧</span>
        {user.email}
      </p>
      <p>
        <span className={styles.icon}>📱</span>
        {formatPhoneNumber(user.phone)}
      </p>
      <p>
        <span className={styles.icon}>🌐</span>
        {user.website}
      </p>
      <p>
        <span className={styles.icon}>🏢</span>
        {user.company.name}
      </p>
    </div>
  );
};

export default UserCard; 