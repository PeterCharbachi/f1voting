import React, { useEffect, useState } from 'react';
import { getAllUsers, adminUpdateVote } from '../services/firebaseApi';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import Select from './ui/Select';

interface User {
  uid: string;
  email: string;
  role: 'user' | 'admin';
}

export default function AdminVoteManagement() {
  const { races, drivers, predictions } = useData();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>(''); // UID
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');
  const [pole, setPole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersRes = await getAllUsers();
        if (usersRes.success) {
          setUsers(usersRes.data as User[]);
        }
      } catch (err: any) {
        setError(err.message || 'Misslyckades med att hämta initial data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUser && selectedRace !== null) {
      const currentVote = predictions.find(
        (vote) => vote.userId === selectedUser && vote.raceId === selectedRace
      );
      if (currentVote) {
        setP1(currentVote.prediction[0] || '');
        setP2(currentVote.prediction[1] || '');
        setP3(currentVote.prediction[2] || '');
        setPole(currentVote.prediction[3] || '');
      } else {
        setP1('');
        setP2('');
        setP3('');
        setPole('');
      }
    } else {
      setP1('');
      setP2('');
      setP3('');
      setPole('');
    }
  }, [selectedUser, selectedRace, predictions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!selectedUser || selectedRace === null || !p1 || !p2 || !p3 || !pole) {
      setError('Vänligen välj användare, lopp och fyll i alla tipsfält.');
      return;
    }
    if (new Set([p1, p2, p3]).size !== 3) {
      setError('Vänligen välj tre olika förare för pallen.');
      return;
    }

    try {
      const response = await adminUpdateVote(selectedUser, selectedRace, [p1, p2, p3, pole]);
      if (response.success) {
        setMessage('Tips uppdaterat!');
      } else {
        setError(response.message || 'Misslyckades med att uppdatera tips.');
      }
    } catch (err: any) {
      setError(err.message || 'Ett fel uppstod vid uppdatering.');
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-text-muted font-bold uppercase tracking-widest animate-pulse">Laddar data...</div>;
  }

  const PredictionDisplay = ({ prediction }: { prediction: string[] }) => (
    <div className="bg-white/5 p-4 border-l-2 border-primary/30 space-y-2 mb-6">
      <div className="flex items-center gap-3">
        <span className="w-8 font-black text-gold italic text-xs">P1</span>
        <span className="text-sm font-bold text-text-light">{drivers.find(d => d.id === prediction[0])?.name || '---'}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-8 font-black text-silver italic text-xs">P2</span>
        <span className="text-sm font-bold text-text-light">{drivers.find(d => d.id === prediction[1])?.name || '---'}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-8 font-black text-bronze italic text-xs">P3</span>
        <span className="text-sm font-bold text-text-light">{drivers.find(d => d.id === prediction[2])?.name || '---'}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-8 font-black text-primary italic text-xs">POLE</span>
        <span className="text-sm font-bold text-primary">{drivers.find(d => d.id === prediction[3])?.name || '---'}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
        <Card className="relative overflow-hidden">
            <div className="hud-corner top-0 left-0 border-t-2 border-l-2"></div>
            <div className="hud-corner top-0 right-0 border-t-2 border-r-2"></div>
            <CardHeader>
                <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Hantera Användartips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label htmlFor="user-select" className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Välj Användare</label>
                        <Select
                            id="user-select"
                            value={selectedUser}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedUser(e.target.value)}
                            className="w-full !py-2 border-l-2 border-white/20"
                        >
                            <option value="">Välj en användare...</option>
                            {users.map((user) => (
                                <option key={user.uid} value={user.uid}>{user.email}</option>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="race-select" className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Välj Lopp</label>
                        <Select
                            id="race-select"
                            value={selectedRace || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRace(e.target.value)}
                            className="w-full !py-2 border-l-2 border-white/20"
                        >
                            <option value="">Välj ett lopp...</option>
                            {races.map((race) => (
                                <option key={race.id} value={race.id}>{race.name}</option>
                            ))}
                        </Select>
                    </div>
                </div>

                {selectedUser && selectedRace !== null && (
                    <div className="pt-6 border-t border-white/5 animate-f1-reveal">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 italic">
                            Nuvarande tips: <span className="text-primary">{users.find(u => u.uid === selectedUser)?.email}</span>
                        </h4>
                        
                        <PredictionDisplay prediction={[p1, p2, p3, pole]} />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[ 
                                    {label: 'P1 VINNARE', val: p1, set: setP1, color: 'border-gold'}, 
                                    {label: 'P2 TVÅA', val: p2, set: setP2, color: 'border-silver'}, 
                                    {label: 'P3 TREA', val: p3, set: setP3, color: 'border-bronze'}, 
                                    {label: 'POLE POSITION', val: pole, set: setPole, color: 'border-primary'} 
                                ].map(({label, val, set, color}) => (
                                    <div key={label} className="space-y-1">
                                        <label className="text-[8px] font-black text-text-muted uppercase tracking-widest ml-1">{label}</label>
                                        <Select value={val} onChange={(e) => set(e.target.value)} required className={`w-full !py-1.5 !text-xs border-l-2 ${color}`}>
                                            <option value="" disabled>Välj förare</option>
                                            {drivers.map(driver => (
                                                <option key={driver.id} value={driver.id}>{driver.name}</option>
                                            ))}
                                        </Select>
                                    </div>
                                ))}
                            </div>
                            
                            {message && <p className="bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold p-2 text-center uppercase tracking-widest">{message}</p>}
                            {error && <p className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold p-2 text-center uppercase tracking-widest animate-shake">{error}</p>}
                            
                            <Button type="submit" className="w-full mt-4 !py-3">Uppdatera Tips</Button>
                        </form>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
