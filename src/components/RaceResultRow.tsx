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
    // Check if any fields are filled. We need at least one to save.
    if (!p1 && !p2 && !p3 && !pole) {
        alert('Vänligen fyll i minst ett resultatfält innan du sparar.');
        return;
    }

    // If podium is being filled, ensure they are unique
    const podiumValues = [p1, p2, p3].filter(v => v !== '');
    if (podiumValues.length > 0 && new Set(podiumValues).size !== podiumValues.length) {
        alert('Samma förare kan inte väljas flera gånger på pallen.');
        return;
    }

    // Construct the result array, using null or empty string for missing values
    // Our data structure expects [p1, p2, p3, pole]
    updateRaceResult(race.id, [p1 || '', p2 || '', p3 || '', pole || '']);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setP1(race.result && race.result[0] ? race.result[0] : '');
    setP2(race.result && race.result[1] ? race.result[1] : '');
    setP3(race.result && race.result[2] ? race.result[2] : '');
    setPole(race.result && race.result[3] ? race.result[3] : '');
    setIsEditing(false);
  };

  return (
    <Tr>
      <Td className="font-semibold">{race.name}</Td>
      <Td className="text-gray-400">{race.date}</Td>
      {isEditing ? (
        <Td colSpan={2} className="py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gold uppercase tracking-widest">P1 - Vinnare</label>
              <Select value={p1} onChange={e => setP1(e.target.value)} className="w-full border-l-2 border-gold">
                  <option value="">Ej fastställt</option>
                  {drivers.map((d: Driver) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-silver uppercase tracking-widest">P2 - Tvåa</label>
              <Select value={p2} onChange={e => setP2(e.target.value)} className="w-full border-l-2 border-silver">
                  <option value="">Ej fastställt</option>
                  {drivers.map((d: Driver) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-bronze uppercase tracking-widest">P3 - Trea</label>
              <Select value={p3} onChange={e => setP3(e.target.value)} className="w-full border-l-2 border-bronze">
                  <option value="">Ej fastställt</option>
                  {drivers.map((d: Driver) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-primary uppercase tracking-widest">Pole Position</label>
              <Select value={pole} onChange={e => setPole(e.target.value)} className="w-full border-l-2 border-primary">
                  <option value="">Ej fastställt</option>
                  {drivers.map((d: Driver) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button onClick={handleCancel} variant="secondary" className="px-6 py-2">Avbryt</Button>
            <Button onClick={handleSave} className="px-6 py-2">Spara Delresultat</Button>
          </div>
        </Td>
      ) : (
        <>
          <Td className="py-4">
            {race.result && (race.result[0] || race.result[1] || race.result[2] || race.result[3]) ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-gold flex items-center justify-center text-[8px] text-black font-bold">1</span>
                      <span className={`font-bold ${race.result[0] ? 'text-text-light' : 'text-text-muted italic opacity-50'}`}>
                        {race.result[0] ? drivers.find((d: Driver) => d.id === race.result![0])?.name : 'TBD'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-silver flex items-center justify-center text-[8px] text-black font-bold">2</span>
                      <span className={`font-bold ${race.result[1] ? 'text-text-light' : 'text-text-muted italic opacity-50'}`}>
                        {race.result[1] ? drivers.find((d: Driver) => d.id === race.result![1])?.name : 'TBD'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-bronze flex items-center justify-center text-[8px] text-black font-bold">3</span>
                      <span className={`font-bold ${race.result[2] ? 'text-text-light' : 'text-text-muted italic opacity-50'}`}>
                        {race.result[2] ? drivers.find((d: Driver) => d.id === race.result![2])?.name : 'TBD'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[8px] text-white font-bold">P</span>
                      <span className={`font-bold ${race.result[3] ? 'text-primary' : 'text-text-muted italic opacity-50'}`}>
                        {race.result[3] ? drivers.find((d: Driver) => d.id === race.result![3])?.name : 'TBD'}
                      </span>
                    </div>
                </div>
            ) : (
              <div className="flex items-center gap-2 text-text-muted italic opacity-50">
                <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse"></div>
                <span>Väntar på resultat</span>
              </div>
            )}
          </Td>
          <Td className="text-right py-4">
            <Button onClick={() => setIsEditing(true)} variant="secondary" className="!py-1.5 !px-4 text-[10px] !italic">
              {(race.result && (race.result[0] || race.result[1] || race.result[2] || race.result[3])) ? 'Uppdatera' : 'Registrera Resultat'}
            </Button>
          </Td>
        </>
      )}
    </Tr>
  );
}
