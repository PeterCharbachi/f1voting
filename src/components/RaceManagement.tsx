import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Table, TableHeader, TableBody, Th, Tr, Td } from './ui/Table';

export default function RaceManagement() {
  const { races, addRace, updateRace, deleteRace } = useData();
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newId, setNewId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDate || !newId) return;
    try {
      await addRace({ name: newName, date: newDate, year: 2026, result: null } as any);
      setNewName('');
      setNewDate('');
      setNewId('');
    } catch (err) {
      alert('Failed to add race');
    }
  };

  const handleEdit = (race: any) => {
    setEditingId(race.id);
    setEditName(race.name);
    setEditDate(race.date);
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateRace(id, { name: editName, date: editDate });
      setEditingId(null);
    } catch (err) {
      alert('Failed to update race');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this race?')) {
      try {
        await deleteRace(id);
      } catch (err) {
        alert('Failed to delete race');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Races (2026)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <Input 
            placeholder="ID (e.g. 2026-01)" 
            value={newId} 
            onChange={e => setNewId(e.target.value)}
          />
          <Input 
            placeholder="Race Name" 
            value={newName} 
            onChange={e => setNewName(e.target.value)}
          />
          <Input 
            type="date"
            value={newDate} 
            onChange={e => setNewDate(e.target.value)}
          />
          <Button type="submit">Add Race</Button>
        </form>

        <Table>
          <TableHeader>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Date</Th>
            <Th className="text-right">Actions</Th>
          </TableHeader>
          <TableBody>
            {races.filter(r => r.year === 2026).map(race => (
              <Tr key={race.id}>
                <Td className="font-bold text-primary">{race.id}</Td>
                <Td>
                  {editingId === race.id ? (
                    <Input value={editName} onChange={e => setEditName(e.target.value)} />
                  ) : (
                    race.name
                  )}
                </Td>
                <Td>
                  {editingId === race.id ? (
                    <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
                  ) : (
                    race.date
                  )}
                </Td>
                <Td className="text-right space-x-2">
                  {editingId === race.id ? (
                    <>
                      <Button onClick={() => handleUpdate(race.id)} className="w-auto py-1 px-3">Save</Button>
                      <Button onClick={() => setEditingId(null)} variant="secondary" className="w-auto py-1 px-3">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEdit(race)} variant="secondary" className="w-auto py-1 px-3">Edit</Button>
                      <Button onClick={() => handleDelete(race.id)} variant="destructive" className="w-auto py-1 px-3 bg-red-600 hover:bg-red-700">Delete</Button>
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
