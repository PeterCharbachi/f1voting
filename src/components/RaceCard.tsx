import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

// Define interfaces to match DataContext
interface Driver {
  id: string;
  name: string;
}

interface Race {
  id: string;
  name: string;
  date: string;
  result: string[] | null;
}



interface RaceCardProps {
  race: Race;
  drivers: Driver[];
}

import Select from './ui/Select';

const PodiumDisplay = ({ podium, drivers, title }: { podium: string[], drivers: Driver[], title?: string }) => (
    <div>
        {title && <h4 className="font-bold text-lg mb-2 text-text-light uppercase">{title}</h4>} 
        <div className="space-y-2">
            <p className="flex items-center"><span className="w-20 font-bold text-gold">1st:</span> <span className="text-text-light">{drivers.find(d => d.id === podium[0])?.name || 'N/A'}</span></p>
            <p className="flex items-center"><span className="w-20 font-bold text-silver">2nd:</span> <span className="text-text-light">{drivers.find(d => d.id === podium[1])?.name || 'N/A'}</span></p>
            <p className="flex items-center"><span className="w-20 font-bold text-bronze">3rd:</span> <span className="text-text-light">{drivers.find(d => d.id === podium[2])?.name || 'N/A'}</span></p>
            <p className="flex items-center"><span className="w-20 font-bold text-primary">Pole:</span> <span className="text-text-light">{drivers.find(d => d.id === podium[3])?.name || 'N/A'}</span></p>
        </div>
    </div>
);

export default function RaceCard({ race, drivers }: RaceCardProps) {
  const { currentUser: user } = useAuth();
  const { userVotes, submitVote } = useData();
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');
  const [pole, setPole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const existingVote = userVotes.find(vote => vote.raceId === race.id);
  const hasVoted = !!existingVote;
  const isRaceFinished = !!race.result;

  useEffect(() => {
    if (existingVote) {
      setP1(existingVote.prediction[0] || '');
      setP2(existingVote.prediction[1] || '');
      setP3(existingVote.prediction[2] || '');
      setPole(existingVote.prediction[3] || '');
    } else {
      setP1('');
      setP2('');
      setP3('');
      setPole('');
    }
  }, [existingVote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!user) {
      setSubmitError('You must be logged in to submit a vote.');
      return;
    }
    if (!p1 || !p2 || !p3 || !pole) {
      setSubmitError('Please select all podium positions and Pole Position.');
      return;
    }
    if (new Set([p1, p2, p3]).size !== 3) {
        setSubmitError('Podium must consist of three different drivers.');
        return;
    }

    setIsSubmitting(true);
    try {
      await submitVote(race.id, [p1, p2, p3, pole]);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit vote.');
    }
  };

  const renderContent = () => {
    if (!user) {
      return <p className="text-center text-text-muted py-4">Login to submit your vote.</p>;
    }
    if (hasVoted) {
        return <PodiumDisplay podium={existingVote!.prediction} drivers={drivers} title="Your Vote" />;
    }
    if (isRaceFinished) {
        return <p className="text-center text-text-muted py-4">Voting has closed for this race.</p>;
    }
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {[ {pos: '1st', val: p1, set: setP1}, {pos: '2nd', val: p2, set: setP2}, {pos: '3rd', val: p3, set: setP3}, {pos: 'Pole', val: pole, set: setPole} ].map(({pos, val, set}) => (
            <div key={pos} className="space-y-1">
              <label className="text-sm font-medium text-text-muted">{pos} {pos === 'Pole' ? 'Position' : 'Place'}</label> 
              <Select value={val} onChange={(e) => set(e.target.value)} required className="w-full">
                <option value="" disabled>Select a driver...</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>{driver.name}</option>
                ))}
              </Select>
            </div>
        ))}
        {submitError && <p className="text-primary text-center !mt-4">{submitError}</p>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Vote'}
        </Button>
      </form>
    );
  }

  return (
    <Card className={`transition duration-300 hover:shadow-primary/40 hover:shadow-lg hover:-translate-y-1 ${hasVoted || isRaceFinished ? 'bg-background-medium/70' : 'bg-background-medium'}`}>
        <CardHeader className="flex justify-between items-center">
            <div>
                <CardTitle className="text-2xl font-bold uppercase">{race.name}</CardTitle>
                <p className="text-sm text-text-muted">{race.date}</p>
            </div>
            {hasVoted && <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full">VOTED</span>}
            {isRaceFinished && !hasVoted && <span className="bg-background-light text-text-muted text-xs font-bold px-3 py-1 rounded-full">CLOSED</span>} 
        </CardHeader>
        <CardContent>
            {renderContent()}
        </CardContent>
    </Card>
  );
}