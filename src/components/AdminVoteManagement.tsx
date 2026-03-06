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
  const [selectedUser, setSelectedUser] = useState<string>(''); // This will be UID
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
        setError(err.message || 'Failed to fetch initial data.');
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
      setError('Please select a user, a race, and all four prediction fields.');
      return;
    }
    if (new Set([p1, p2, p3]).size !== 3) {
      setError('Please select three different drivers for the podium.');
      return;
    }

    try {
      const response = await adminUpdateVote(selectedUser, selectedRace, [p1, p2, p3, pole]);
      if (response.success) {
        setMessage('Vote updated successfully!');
        // The DataContext will automatically update, no need to fetchAllVotes
      } else {
        setError(response.message || 'Failed to update vote.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update vote.');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  const PredictionDisplay = ({ prediction }: { prediction: string[] }) => (
    <div className="space-y-1 text-sm">
      <p><span className="font-semibold text-gold w-8 inline-block">1st</span> {drivers.find(d => d.id === prediction[0])?.name || 'N/A'}</p>
      <p><span className="font-semibold text-silver w-8 inline-block">2nd</span> {drivers.find(d => d.id === prediction[1])?.name || 'N/A'}</p>
      <p><span className="font-semibold text-bronze w-8 inline-block">3rd</span> {drivers.find(d => d.id === prediction[2])?.name || 'N/A'}</p>
      <p><span className="font-semibold text-primary w-8 inline-block">Pole</span> {drivers.find(d => d.id === prediction[3])?.name || 'N/A'}</p>
    </div>
  );

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Manage User Votes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="user-select" className="block text-sm font-medium text-gray-400">Select User</label>
            <Select
              id="user-select"
              value={selectedUser}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedUser(e.target.value)}
              className="w-full"
            >
              <option value="">Select a user...</option>
              {users.map((user) => (
                <option key={user.uid} value={user.uid}>{user.email}</option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="race-select" className="block text-sm font-medium text-gray-400">Select Race</label>
            <Select
              id="race-select"
              value={selectedRace || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRace(e.target.value)}
              className="w-full"
            >
              <option value="">Select a race...</option>
              {races.map((race) => (
                <option key={race.id} value={race.id}>{race.name}</option>
              ))}
            </Select>
          </div>

          {selectedUser && selectedRace !== null && ( // Only show prediction form if user and race are selected
            <>
              <h4 className="font-bold text-lg text-gray-100 mt-4">Current Prediction for {users.find(u => u.uid === selectedUser)?.email} - {races.find(r => r.id === selectedRace)?.name}</h4>
              <PredictionDisplay prediction={[p1, p2, p3, pole]} />

              <div className="space-y-2">
                {[ {pos: '1st', val: p1, set: setP1}, {pos: '2nd', val: p2, set: setP2}, {pos: '3rd', val: p3, set: setP3}, {pos: 'Pole', val: pole, set: setPole} ].map(({pos, val, set}) => (
                    <div key={pos} className="space-y-1">
                      <label className="text-sm font-medium text-gray-400">{pos} {pos === 'Pole' ? 'Position' : 'Place'}</label>
                      <Select value={val} onChange={(e) => set(e.target.value)} required className="w-full">
                        <option value="" disabled>Select a driver...</option>
                        {drivers.map(driver => (
                          <option key={driver.id} value={driver.id}>{driver.name}</option>
                        ))}
                      </Select>
                    </div>
                ))}
              </div>
              {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <Button type="submit" className="w-full">Update Vote</Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
