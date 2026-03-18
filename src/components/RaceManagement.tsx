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
      alert('Misslyckades med att lägga till lopp');
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
      alert('Misslyckades med att uppdatera lopp');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Är du säker på att du vill ta bort detta lopp?')) {
      try {
        await deleteRace(id);
      } catch (err) {
        alert('Misslyckades med att ta bort lopp');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        <div className="hud-corner top-0 left-0 border-t-2 border-l-2"></div>
        <div className="hud-corner bottom-0 right-0 border-b-2 border-r-2"></div>
        <CardHeader>
          <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Registrera nytt lopp (2026)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
                <label className="text-[8px] font-black text-text-muted uppercase tracking-widest ml-1 block">Lopp-ID</label>
                <Input 
                    placeholder="t.ex. 2026-01" 
                    value={newId} 
                    onChange={e => setNewId(e.target.value)}
                    className="w-full !py-2 border-l-2 border-primary"
                />
            </div>
            <div className="space-y-1 sm:col-span-1">
                <label className="text-[8px] font-black text-text-muted uppercase tracking-widest ml-1 block">Tävlingens namn</label>
                <Input 
                    placeholder="Grand Prix Namn" 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                    className="w-full !py-2"
                />
            </div>
            <div className="space-y-1">
                <label className="text-[8px] font-black text-text-muted uppercase tracking-widest ml-1 block">Datum</label>
                <Input 
                    type="date"
                    value={newDate} 
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full !py-2"
                />
            </div>
            <div className="flex items-end">
                <Button type="submit" className="w-full !py-2">Addera</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="hud-corner top-0 right-0 border-t-2 border-r-2"></div>
        <CardHeader>
          <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Säsongskalender 2026</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <Th>ID</Th>
              <Th>Tävling</Th>
              <Th>Datum</Th>
              <Th className="text-right">Åtgärder</Th>
            </TableHeader>
            <TableBody>
              {races.filter(r => r.year === 2026).sort((a,b) => a.date.localeCompare(b.date)).map(race => (
                <Tr key={race.id} className={editingId === race.id ? 'bg-primary/5' : ''}>
                  <Td className="font-mono text-[10px] text-primary font-bold">{race.id}</Td>
                  <Td>
                    {editingId === race.id ? (
                      <Input value={editName} onChange={e => setEditName(e.target.value)} className="!py-1 !text-xs w-full" />
                    ) : (
                      <span className="font-bold text-text-light">{race.name}</span>
                    )}
                  </Td>
                  <Td>
                    {editingId === race.id ? (
                      <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="!py-1 !text-xs w-full" />
                    ) : (
                      <span className="text-text-muted text-xs font-medium italic">{race.date}</span>
                    )}
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                        {editingId === race.id ? (
                        <>
                            <Button onClick={() => handleUpdate(race.id)} className="!py-1 !px-3 text-[10px]">Spara</Button>
                            <Button onClick={() => setEditingId(null)} variant="secondary" className="!py-1 !px-3 text-[10px]">Avbryt</Button>
                        </>
                        ) : (
                        <>
                            <Button onClick={() => handleEdit(race)} variant="outline" className="!py-1 !px-3 text-[10px] !italic">Ändra</Button>
                            <Button onClick={() => handleDelete(race.id)} variant="destructive" className="!py-1 !px-3 text-[10px] !italic">Ta bort</Button>
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
    </div>
  );
}
