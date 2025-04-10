import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS, QUERY_ME } from '../graphQL/queries';
import { SET_USER_ROLE, DELETE_USER } from '../graphQL/mutations';
import { useNavigate } from 'react-router-dom';
import EditUserButton from '../components/EditUserButton';
import '../styles/Admin.css';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('lastname');
  const [sortDirection, setSortDirection] = useState('asc');
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // Get the current user to check if they're an admin
  const { data: userData, loading: userLoading } = useQuery(QUERY_ME);
  
  // Fetch all users
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS, {
    fetchPolicy: 'network-only', // Don't use the cache
  });

  // Set user role mutation
  const [setUserRole, { loading: settingRole }] = useMutation(SET_USER_ROLE, {
    onCompleted: () => {
      setMessage({ text: 'User role updated successfully', type: 'success' });
      // Clear the message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
      refetch(); // Refresh the users list
    },
    onError: (error) => {
      setMessage({ text: `Error updating role: ${error.message}`, type: 'error' });
      // Clear the message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  });

  // Delete user
  const [deleteUser, { loading: deletingUser }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      setMessage({ text: 'User deleted successfully', type: 'success' });
      // Clear the message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
      refetch(); // Refresh the users list
    },
    onError: (error) => {
      setMessage({ text: `Error deleting user: ${error.message}`, type: 'error' });
      // Clear the message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  });


  // Check if user is admin, if not redirect to home
  useEffect(() => {
    if (!userLoading && userData) {
      if (userData.me.role !== 'admin') {
        navigate('/');
      }
    }
  }, [userData, userLoading, navigate]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter for sorting users
  const getFilteredAndSortedUsers = () => {
    if (!data || !data.users) return [];

    const filtered = data.users.filter((user: any) => {
      const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    return filtered.sort((a: any, b: any) => {
      let comparison = 0;
      
      if (a[sortField] < b[sortField]) {
        comparison = -1;
      } else if (a[sortField] > b[sortField]) {
        comparison = 1;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  // Handle role toggle
  const handleRoleToggle = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    // Confirm before changing role
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      setUserRole({
        variables: {
          userId,
          role: newRole
        }
      });
    }
  };

// Handle deleting user
const handleDeleteUser = (userId: string, firstName: string, lastName: string) => {
  if (window.confirm(`Are you sure you want to delete user ${firstName} ${lastName}? This action cannot be undone and will remove all associated data.`)) {
    deleteUser({
      variables: {
        userId
      }
    });
  }
};


  if (userLoading) return <div className="admin-container"><p>Loading...</p></div>;
  if (!userData || userData.me.role !== 'admin') return null;
  
  if (loading) return <div className="admin-container"><p>Loading users...</p></div>;
  if (error) return <div className="admin-container"><p>Error loading users: {error.message}</p></div>;

  const filteredUsers = getFilteredAndSortedUsers();

  return (
    <div className="main-container">

      <div className="content-container">
        <div className="admin-container">
          <h1>Admin Dashboard</h1>
          <h2>User Management</h2>
          
          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={() => refetch()} className="refresh-btn" disabled={loading || settingRole}>
              Refresh
            </button>
          </div>
          
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('firstname')}>
                    First Name {sortField === 'firstname' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('lastname')}>
                    Last Name {sortField === 'lastname' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('email')}>
                    Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('role')}>
                    Role {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('createdAt')}>
                    Created At {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: any) => (
                  <tr key={user._id}>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role || 'user'}`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }) : 'N/A'}</td>
                    <td className='action-buttons'>
                    <EditUserButton 
                        user={user} 
                        refetch={refetch} 
                      />
                      <button 
                        className="role-toggle-btn"
                        onClick={() => handleRoleToggle(user._id, user.role || 'user')}
                        disabled={settingRole || user._id === userData.me._id} // Prevent changing own role
                        title={user._id === userData.me._id ? "Cannot change your own role" : ""}
                      >
                        {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                      </button>
                      <button 
                        className="delete-user-btn"
                        onClick={() => handleDeleteUser(user._id, user.firstname, user.lastname)}
                        disabled={deletingUser || user._id === userData.me._id} // Prevent deleting own account
                        title={user._id === userData.me._id ? "Cannot delete your own account" : ""}
                      >
                        Delete User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="no-users">No users found matching the search criteria.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;