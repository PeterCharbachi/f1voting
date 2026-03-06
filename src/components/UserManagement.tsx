import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../services/firebaseApi';
import { Table, TableBody, TableHeader, Th, Tr, Td } from './ui/Table';
import { Button } from './ui/Button';
import Select from './ui/Select';
import { Input } from './ui/Input'; // Import Input component

interface User {
  uid: string;
  email: string;
  username?: string;
  role: 'user' | 'admin';
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null); // User currently being edited
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editPasswordConfirm, setEditPasswordConfirm] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllUsers();
      if (response.success) {
        setUsers(response.data as User[]);
      } else {
        setError(response.message || 'Failed to fetch users.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditUsername(user.username || '');
    setEditPassword(''); // Clear password fields when starting edit
    setEditPasswordConfirm('');
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    setEditError(null);
    if (editPassword && editPassword !== editPasswordConfirm) {
      setEditError('Passwords do not match.');
      return;
    }

    try {
      const updates: { role?: 'user' | 'admin', username?: string } = { 
        role: editRole,
        username: editUsername
      };
      // Password changes are handled via Firebase Auth directly, not via Firestore user doc update
      // For now, we only update the role and username in Firestore.
      const response = await updateUser(editingUser.uid, updates);
      if (response.success) {
        setEditingUser(null); // Exit edit mode
        fetchUsers(); // Refresh the list
      } else {
        setEditError(response.message || 'Failed to update user.');
      }
    } catch (err: any) {
      setEditError(err.message || 'An error occurred while updating user.');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditError(null);
  };

  const handleDeleteUser = async (uid: string) => {
    if (window.confirm(`Are you sure you want to delete user with UID "${uid}"?`)) {
      try {
        const response = await deleteUser(uid);
        if (response.success) {
          fetchUsers(); // Refresh the list
        } else {
          setError(response.message || 'Failed to delete user.');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while deleting user.');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">User Management</h2>
      <Table>
        <TableHeader>
            <Th className="w-[150px]">Email</Th>
            <Th>Username</Th>
            <Th>Role</Th>
            <Th className="text-right">Actions</Th>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <Tr key={user.uid}>
              <Td className="font-medium">{user.email}</Td>
              <Td>{user.username || <span className="text-gray-500 italic">Not set</span>}</Td>
              <Td>
                {editingUser?.uid === user.uid ? (
                  <Select
                    value={editRole}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditRole(e.target.value as 'user' | 'admin')}
                    className="w-[120px]"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Select>
                ) : (
                  user.role
                )}
              </Td>
              <Td className="text-right space-x-2">
                {editingUser?.uid === user.uid ? (
                  <> 
                    <Button variant="default" onClick={handleSaveEdit}>Save</Button>
                    <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                  </>
                ) : (
                  <> 
                    <Button variant="outline" onClick={() => handleEditClick(user)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDeleteUser(user.uid)}>Delete</Button>
                  </>
                )}
              </Td>
            </Tr>
          ))}
        </TableBody>
      </Table>

      {editingUser && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-100">Edit User: {editingUser.email}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400" htmlFor="editUsername">Username</label>
              <Input
                id="editUsername"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400" htmlFor="editRole">Role</label>
              <Select
                id="editRole"
                value={editRole}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditRole(e.target.value as 'user' | 'admin')}
                className="w-full"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400" htmlFor="editPassword">New Password (optional)</label>
              <Input
                type="password"
                id="editPassword"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400" htmlFor="editPasswordConfirm">Confirm New Password</label>
              <Input
                type="password"
                id="editPasswordConfirm"
                value={editPasswordConfirm}
                onChange={(e) => setEditPasswordConfirm(e.target.value)} 
                className="w-full"
              />
            </div>
            {editError && <p className="text-red-500 text-sm mt-2">{editError}</p>}
            <div className="flex justify-end space-x-2">
              <Button variant="default" onClick={handleSaveEdit}>Save Changes</Button>
              <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}