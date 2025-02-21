import { useState } from 'react';

// User container component
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="users-container">
      <h2>Users</h2>
      {/*Component ode to be added*/}
    </div>
  );
};

export default Users; 