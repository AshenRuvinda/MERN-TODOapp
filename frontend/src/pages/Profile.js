import { useContext } from 'react';
  import { AuthContext } from '../context/AuthContext';

  const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <div className="text-center p-6">Loading...</div>;

    return (
      <div className="max-w-md mx-auto p-6">
        <div className="card">
          <h2 className="text-3xl font-bold mb-6 text-primary">Profile</h2>
          <p className="text-secondary mb-2">Email: <span className="font-semibold">{user.email}</span></p>
          <p className="text-secondary">Display Name: <span className="font-semibold">{user.displayName || 'Not set'}</span></p>
        </div>
      </div>
    );
  };

  export default Profile;