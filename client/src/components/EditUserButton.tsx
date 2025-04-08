import React, { useState, ChangeEvent } from 'react';
import { Pencil, X } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../graphQL/mutations';


// Define interface for the user object
interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role?: string;
}

// Define props interface
interface EditUserButtonProps {
  user: User;
  refetch: () => void;
}

// Define form data interface
interface UserFormData {
  firstname: string;
  lastname: string;
  email: string;
}

const EditUserButton: React.FC<EditUserButtonProps> = ({ user, refetch }) => {
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserFormData>({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
  });
  
  // Define the update user mutation
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setIsEditing(false);
      refetch(); // Refresh the users list after update
    },
    onError: (error) => {
      alert(`Error updating user: ${error.message}`);
    }
  });
  
  const handleEdit = (): void => {
    setIsEditing(true);
  };
  
  const handleCancel = (): void => {
    setIsEditing(false);
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });
  };
  
  const handleSave = (): void => {
    updateUser({
      variables: {
        userId: user._id,
        userData: formData
      }
    });
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <>
      {!isEditing ? (
        <button 
          onClick={handleEdit}
          className="edit-user-btn"
          title="Edit user details"
        >
          <Pencil size={16} /> Edit
        </button>
      ) : (
        <div className="edit-form-overlay">
          <div className="edit-form">
            <div className="edit-form-header">
              <h3>Edit User</h3>
              <button onClick={handleCancel} className="close-btn">
                <X size={18} />
              </button>
            </div>
            
            <div className="form-group">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          
            <div className="form-actions">
              <button onClick={handleCancel} className="cancel-btn" disabled={updating}>
                Cancel
              </button>
              <button onClick={handleSave} className="save-btn" disabled={updating}>
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditUserButton;