import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Table, TableHeader, TableBody, Th, Tr, Td } from './ui/Table';

export default function DriverManagement() {
  const { drivers, addDriver, updateDriver, deleteDriver } = useData();
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverId, setNewDriverId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName || !newDriverId) return;
    try {
      await addDriver({ name: newDriverName, id: newDriverId } as any);
      setNewDriverName('');
      setNewDriverId('');
    } catch (err) {
      alert('Failed to add driver');
    }
  };

  const handleEdit = (driver: { id: string, name: string }) => {
    setEditingId(driver.id);
    setEditName(driver.name);
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateDriver(id, { name: editName });
      setEditingId(null);
    } catch (err) {
      alert('Failed to update driver');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await deleteDriver(id);
      } catch (err) {
        alert('Failed to delete driver');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Drivers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input 
            placeholder="ID (e.g. VER)" 
            value={newDriverId} 
            onChange={e => setNewDriverId(e.target.value.toUpperCase())}
            className="w-24"
          />
          <Input 
            placeholder="Driver Name" 
            value={newDriverName} 
            onChange={e => setNewDriverName(e.target.value)}
          />
          <Button type="submit">Add</Button>
        </form>

        <Table>
          <TableHeader>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th className="text-right">Actions</Th>
          </TableHeader>
          <TableBody>
            {drivers.map(driver => (
              <Tr key={driver.id}>
                <Td className="font-bold text-primary">{driver.id}</Td>
                <Td>
                  {editingId === driver.id ? (
                    <Input value={editName} onChange={e => setEditName(e.target.value)} />
                  ) : (
                    driver.name
                  )}
                </Td>
                <Td className="text-right space-x-2">
                  {editingId === driver.id ? (
                    <>
                      <Button onClick={() => handleUpdate(driver.id)} className="w-auto py-1 px-3">Save</Button>
                      <Button onClick={() => setEditingId(null)} variant="secondary" className="w-auto py-1 px-3">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEdit(driver)} variant="secondary" className="w-auto py-1 px-3">Edit</Button>
                      <Button onClick={() => handleDelete(driver.id)} variant="destructive" className="w-auto py-1 px-3 bg-red-600 hover:bg-red-700">Delete</Button>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
