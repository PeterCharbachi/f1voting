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
      alert('Misslyckades med att lägga till förare');
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
      alert('Misslyckades med att uppdatera förare');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Är du säker på att du vill ta bort denna förare?')) {
      try {
        await deleteDriver(id);
      } catch (err) {
        alert('Misslyckades med att ta bort förare');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        <div className="hud-corner top-0 left-0 border-t-2 border-l-2"></div>
        <div className="hud-corner bottom-0 right-0 border-b-2 border-r-2"></div>
        <CardHeader>
          <CardTitle className="text-xl font-black italic uppercase tracking-tighter text-white">Lägg till ny förare</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-none w-full sm:w-32">
                <label className="text-[8px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1 block">Förarkod (ID)</label>
                <Input 
                    placeholder="t.ex. VER" 
                    value={newDriverId} 
                    onChange={e => setNewDriverId(e.target.value.toUpperCase())}
                    className="w-full !py-2 border-l-2 border-primary"
                    maxLength={3}
                />
            </div>
            <div className="flex-1">
                <label className="text-[8px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1 block">Fullständigt namn</label>
                <Input 
                    placeholder="Namn på föraren" 
                    value={newDriverName} 
                    onChange={e => setNewDriverName(e.target.value)}
                    className="w-full !py-2"
                />
            </div>
            <div className="flex items-end">
                <Button type="submit" className="w-full sm:w-auto !py-2 px-8">Registrera</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="hud-corner top-0 right-0 border-t-2 border-r-2"></div>
        <CardHeader>
          <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Aktiva Förare</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <Th>Kod</Th>
              <Th>Namn</Th>
              <Th className="text-right">Åtgärder</Th>
            </TableHeader>
            <TableBody>
              {drivers.sort((a,b) => a.id.localeCompare(b.id)).map(driver => (
                <Tr key={driver.id} className={editingId === driver.id ? 'bg-primary/5' : ''}>
                  <Td className="font-black text-primary italic tracking-widest">{driver.id}</Td>
                  <Td>
                    {editingId === driver.id ? (
                      <Input 
                        value={editName} 
                        onChange={e => setEditName(e.target.value)} 
                        className="!py-1 !text-xs w-full max-w-xs"
                      />
                    ) : (
                      <span className="font-bold text-text-light">{driver.name}</span>
                    )}
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                        {editingId === driver.id ? (
                        <>
                            <Button onClick={() => handleUpdate(driver.id)} className="!py-1 !px-3 text-[10px]">Spara</Button>
                            <Button onClick={() => setEditingId(null)} variant="secondary" className="!py-1 !px-3 text-[10px]">Avbryt</Button>
                        </>
                        ) : (
                        <>
                            <Button onClick={() => handleEdit(driver)} variant="outline" className="!py-1 !px-3 text-[10px] !italic">Ändra</Button>
                            <Button onClick={() => handleDelete(driver.id)} variant="destructive" className="!py-1 !px-3 text-[10px] !italic">Ta bort</Button>
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
