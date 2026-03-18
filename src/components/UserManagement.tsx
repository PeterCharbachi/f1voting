import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../services/firebaseApi';
import { Table, TableBody, TableHeader, Th, Tr, Td } from './ui/Table';
import { Button } from './ui/Button';
import Select from './ui/Select';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

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
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');
  const [editUsername, setEditUsername] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllUsers();
      if (response.success) {
        setUsers(response.data as User[]);
      } else {
        setError(response.message || 'Misslyckades med att hämta användare.');
      }
    } catch (err: any) {
      setError(err.message || 'Ett fel uppstod vid hämtning av användare.');
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
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    setEditError(null);
    try {
      const updates = { 
        role: editRole,
        username: editUsername
      };
      const response = await updateUser(editingUser.uid, updates);
      if (response.success) {
        setEditingUser(null);
        fetchUsers();
      } else {
        setEditError(response.message || 'Misslyckades med att uppdatera användaren.');
      }
    } catch (err: any) {
      setEditError(err.message || 'Ett fel uppstod vid uppdatering.');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditError(null);
  };

  const handleDeleteUser = async (uid: string) => {
    if (window.confirm(`Är du säker på att du vill ta bort användaren med UID "${uid}"?`)) {
      try {
        const response = await deleteUser(uid);
        if (response.success) {
          fetchUsers();
        } else {
          setError(response.message || 'Misslyckades med att ta bort användaren.');
        }
      } catch (err: any) {
        setError(err.message || 'Ett fel uppstod vid borttagning.');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-text-muted font-bold animate-pulse uppercase tracking-widest text-xs">Laddar användardata...</div>;
  }

  if (error) {
    return (
        <div className="bg-primary/10 border border-primary/20 p-6 text-center">
            <p className="text-primary font-black uppercase italic">Systemfel: {error}</p>
            <Button onClick={fetchUsers} className="mt-4">Försök igen</Button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        <div className="hud-corner top-0 left-0 border-t-2 border-l-2"></div>
        <div className="hud-corner top-0 right-0 border-t-2 border-r-2"></div>
        <CardHeader>
            <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Användarregister</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
                <Th>E-post / ID</Th>
                <Th>Användarnamn</Th>
                <Th>Roll</Th>
                <Th className="text-right">Åtgärder</Th>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <Tr key={user.uid} className={editingUser?.uid === user.uid ? 'bg-primary/5' : ''}>
                  <Td>
                    <div className="flex flex-col">
                        <span className="font-bold text-text-light">{user.email}</span>
                        <span className="text-[8px] font-mono text-text-muted">UID: {user.uid}</span>
                    </div>
                  </Td>
                  <Td>
                    {editingUser?.uid === user.uid ? (
                        <Input
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            placeholder="Användarnamn"
                            className="w-full !py-1 !text-xs"
                        />
                    ) : (
                        <span className={user.username ? 'font-bold' : 'text-text-muted italic'}>
                            {user.username || 'Ej angivet'}
                        </span>
                    )}
                  </Td>
                  <Td>
                    {editingUser?.uid === user.uid ? (
                      <Select
                        value={editRole}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditRole(e.target.value as 'user' | 'admin')}
                        className="w-full !py-1 !text-xs border-l-2 border-primary"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </Select>
                    ) : (
                      <span className={`text-[10px] font-black px-2 py-0.5 italic skew-x-[-12deg] ${user.role === 'admin' ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}>
                        {user.role.toUpperCase()}
                      </span>
                    )}
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                        {editingUser?.uid === user.uid ? (
                        <> 
                            <Button onClick={handleSaveEdit} className="!py-1 !px-3 text-[10px]">Spara</Button>
                            <Button variant="secondary" onClick={handleCancelEdit} className="!py-1 !px-3 text-[10px]">Avbryt</Button>
                        </>
                        ) : (
                        <> 
                            <Button variant="outline" onClick={() => handleEditClick(user)} className="!py-1 !px-3 text-[10px] !italic">Ändra</Button>
                            <Button variant="destructive" onClick={() => handleDeleteUser(user.uid)} className="!py-1 !px-3 text-[10px] !italic">Ta bort</Button>
                        </>
                        )}
                    </div>
                  </Td>
                </Tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {editError && (
        <div className="bg-primary/10 border border-primary p-3 text-center animate-shake">
            <p className="text-primary text-[10px] font-black uppercase italic">{editError}</p>
        </div>
      )}
    </div>
  );
}
