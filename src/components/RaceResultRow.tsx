import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Tr, Td } from './ui/Table';
import { Button } from './ui/Button';

import Select from './ui/Select';

interface Race {
  id: string;
  name: string;
  date: string;
  result: string[] | null;
  year: number;
}

interface Driver {
  id: string;
  name: string;
}

interface RaceResultRowProps {
  race: Race;
  drivers: Driver[];
}

export default function RaceResultRow({ race, drivers }: RaceResultRowProps) {
  const { updateRaceResult } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [p1, setP1] = useState(race.result ? race.result[0] : '');
  const [p2, setP2] = useState(race.result ? race.result[1] : '');
  const [p3, setP3] = useState(race.result ? race.result[2] : '');
  const [pole, setPole] = useState(race.result ? race.result[3] : '');

  const handleSave = () => {
    if (new Set([p1, p2, p3]).size !== 3 || !p1 || !p2 || !p3 || !pole) {
        alert('Please select three different drivers for the podium and one for Pole.');
        return;
    }
    updateRaceResult(race.id, [p1, p2, p3, pole]);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setP1(race.result ? race.result[0] : '');
    setP2(race.result ? race.result[1] : '');
    setP3(race.result ? race.result[2] : '');
    setPole(race.result ? race.result[3] : '');
    setIsEditing(false);
  };

  return (
    <Tr>
      <Td className="font-semibold">{race.name}</Td>
      <Td className="text-gray-400">{race.date}</Td>
      {isEditing ? (
        <Td colSpan={2} className="">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={p1} onChange={e => setP1(e.target.value)} required className="w-32">
                <option value="" disabled>1st Place</option>
                {drivers.map((d: Driver) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
            <Select value={p2} onChange={e => setP2(e.target.value)} required className="w-32">
                <option value="" disabled>2nd Place</option>
                {drivers.map((d: Driver) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
            <Select value={p3} onChange={e => setP3(e.target.value)} required className="w-32">
                <option value="" disabled>3rd Place</option>
                {drivers.map((d: Driver) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
            <Select value={pole} onChange={e => setPole(e.target.value)} required className="w-32">
                <option value="" disabled>Pole</option>
                {drivers.map((d: Driver) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
            <Button onClick={handleSave} className="w-auto text-sm py-2">Save</Button>
            <Button onClick={handleCancel} variant="secondary" className="w-auto text-sm py-2">Cancel</Button>
          </div>
        </Td>
      ) : (
        <>
          <Td className="">
            {race.result ? (
                <div className="space-y-1 text-sm">
                    <p>1st: {drivers.find((d: Driver) => d.id === race.result![0])?.name}</p>
                    <p>2nd: {drivers.find((d: Driver) => d.id === race.result![1])?.name}</p>
                    <p>3rd: {drivers.find((d: Driver) => d.id === race.result![2])?.name}</p>
                    <p>Pole: {drivers.find((d: Driver) => d.id === race.result![3])?.name}</p>
                </div>
            ) : <span className="text-gray-500">Not set</span>}
          </Td>
          <Td className="text-right">
            <Button onClick={() => setIsEditing(true)} variant="secondary" className="w-auto text-sm py-2">Edit</Button>
          </Td>
        </>
      )}
    </Tr>
  );
}