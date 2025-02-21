import { User } from '../services/api';

// component props
interface UserCardProps {
  user: User;
}

// User card component for displaying user information
const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Website: {user.website}</p>
      <p>Company: {user.company.name}</p>
    </div>
  );
};

export default UserCard; 