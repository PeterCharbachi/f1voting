import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { useCountdown } from '../hooks/useCountdown';
import { calculatePoints } from '../services/scoring';
import Select from './ui/Select';

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
  year: number;
}

interface RaceCardProps {
  race: Race;
  drivers: Driver[];
}

const PodiumDisplay = ({ podium, drivers, title, points }: { podium: string[], drivers: Driver[], title?: string, points?: number }) => (
    <div className="bg-white/5 backdrop-blur-sm p-4 border-l-2 border-primary/30 relative group">
        <div className="flex justify-between items-center mb-4">
            {title && <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{title}</h4>}
            {points !== undefined && (
                <div className="bg-primary px-2 py-0.5 text-white font-black text-[10px] italic skew-x-[-12deg]">
                    +{points} PTS
                </div>
            )}
        </div>
        <div className="space-y-3">
            {[
                { label: 'P1', color: 'text-gold', id: podium[0], rank: '01' },
                { label: 'P2', color: 'text-silver', id: podium[1], rank: '02' },
                { label: 'P3', color: 'text-bronze', id: podium[2], rank: '03' },
                { label: 'POLE', color: 'text-primary', id: podium[3], rank: 'PL' }
            ].map((pos, idx) => (
                <div key={idx} className="flex items-center gap-4 text-xs group/item">
                    <span className="font-mono text-[8px] text-text-muted/50">{pos.rank}</span>
                    <span className={`w-8 font-black ${pos.color} italic`}>{pos.label}</span>
                    <span className="text-text-light font-bold uppercase tracking-tight flex-1 border-b border-white/5 pb-1 group-hover/item:border-primary/30 transition-colors">
                        {drivers.find(d => d.id === pos.id)?.name || '---'}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

const CountdownDisplay = ({ date }: { date: string }) => {
    const { days, hours, minutes, seconds, isOver } = useCountdown(date);
    if (isOver) return null;

    return (
        <div className="flex gap-1">
            {[
                { label: 'D', value: days },
                { label: 'H', value: hours },
                { label: 'M', value: minutes },
                { label: 'S', value: seconds }
            ].map(item => (
                <div key={item.label} className="flex flex-col items-center bg-background-dark/80 px-1.5 py-1 min-w-[28px] border border-white/5">
                    <span className="text-[10px] font-black text-primary leading-none">{item.value}</span>
                    <span className="text-[7px] text-text-muted font-bold leading-none mt-1">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const CommunityStats = ({ raceId, predictions, drivers }: { raceId: string, predictions: any[], drivers: Driver[] }) => {
    const racePredictions = predictions.filter(p => p.raceId === raceId);
    const totalVotes = racePredictions.length;

    if (totalVotes === 0) return null;

    const getTopChoice = (index: number) => {
        const counts: { [key: string]: number } = {};
        racePredictions.forEach(p => {
            const driverId = p.prediction[index];
            if (driverId) counts[driverId] = (counts[driverId] || 0) + 1;
        });

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        if (sorted.length === 0) return { name: '---', percentage: 0 };
        
        const [topDriverId, count] = sorted[0];
        const percentage = Math.round((count / totalVotes) * 100);
        return { name: drivers.find(d => d.id === topDriverId)?.name || 'Okänd', percentage };
    };

    return (
        <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Community Hub</h4>
                <span className="text-[8px] font-mono text-primary/60 italic">VOL: {totalVotes}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {[ {l: 'P1', i: 0}, {l: 'P2', i: 1}, {l: 'P3', i: 2}, {l: 'POLE', i: 3} ].map(pos => {
                    const top = getTopChoice(pos.i);
                    return (
                        <div key={pos.l} className="bg-white/5 p-2 border border-white/5 relative group/stat">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[8px] font-black text-primary italic">{pos.l}</span>
                                <span className="text-[8px] font-mono text-white/60">{top.percentage}%</span>
                            </div>
                            <div className="text-[10px] text-text-light truncate font-bold uppercase tracking-tighter">
                                {top.name}
                            </div>
                            <div className="absolute bottom-0 left-0 h-[1px] bg-primary group-hover/stat:w-full transition-all duration-500" style={{ width: `${top.percentage}%` }} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function RaceCard({ race, drivers }: RaceCardProps) {
  const { currentUser: user } = useAuth();
  const { userVotes, predictions, submitVote } = useData();
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');
  const [pole, setPole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const existingVote = userVotes.find(vote => vote.raceId === race.id);
  const hasVoted = !!existingVote;
  const isRaceFinished = !!race.result;
  const { isOver: isVotingClosed } = useCountdown(race.date);

  useEffect(() => {
    if (existingVote) {
      setP1(existingVote.prediction[0] || '');
      setP2(existingVote.prediction[1] || '');
      setP3(existingVote.prediction[2] || '');
      setPole(existingVote.prediction[3] || '');
    } else {
      setP1(''); setP2(''); setP3(''); setPole('');
    }
  }, [existingVote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!user) { setSubmitError('Logga in först.'); return; }
    if (!p1 || !p2 || !p3 || !pole) { setSubmitError('Välj alla platser.'); return; }
    if (new Set([p1, p2, p3]).size !== 3) { setSubmitError('Dubbla förare på pallen.'); return; }

    setIsSubmitting(true);
    try {
      await submitVote(race.id, [p1, p2, p3, pole]);
    } catch (err: any) {
      setSubmitError('Fel vid sändning.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="text-center py-10">
            <p className="text-[10px] text-text-muted uppercase tracking-widest mb-6 font-bold">Autentisering krävs</p>
            <Button variant="primary" onClick={() => window.location.href = '/login'} className="w-full">System Login</Button>
        </div>
      );
    }

    if (isRaceFinished) {
        const points = existingVote ? calculatePoints(existingVote, race.result) : 0;
        return (
            <div className="space-y-6">
                <PodiumDisplay podium={race.result!} drivers={drivers} title="Official FIA Result" />
                {hasVoted ? (
                    <>
                        <PodiumDisplay podium={existingVote.prediction} drivers={drivers} title="User Prediction" points={points} />
                        <CommunityStats raceId={race.id} predictions={predictions} drivers={drivers} />
                    </>
                ) : (
                    <div className="p-6 bg-white/5 border border-dashed border-white/10 text-center">
                        <p className="text-[10px] text-text-muted uppercase font-bold italic">Ingen data registrerad</p>
                        <CommunityStats raceId={race.id} predictions={predictions} drivers={drivers} />
                    </div>
                )}
            </div>
        );
    }

    if (hasVoted) {
        return (
            <div className="space-y-6">
                <PodiumDisplay podium={existingVote.prediction} drivers={drivers} title={isVotingClosed ? "Data Locked" : "User Confirmed"} />
                {!isVotingClosed && (
                    <div className="text-center">
                        <div className="inline-block bg-primary/10 text-primary text-[8px] font-black px-3 py-1 mb-2 uppercase tracking-widest">Prediction Transmitted</div>
                        <p className="text-[8px] text-text-muted font-mono uppercase tracking-tighter italic">Deadline: {race.date} T00:00:00Z</p>
                    </div>
                )}
                <CommunityStats raceId={race.id} predictions={predictions} drivers={drivers} />
            </div>
        );
    }

    if (isVotingClosed) {
        return (
            <div className="text-center py-8 border border-white/5">
                <p className="text-[10px] text-primary uppercase font-black italic tracking-widest">Röstning stängd</p>
                <CommunityStats raceId={race.id} predictions={predictions} drivers={drivers} />
            </div>
        );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {[ 
            { label: 'Winner P1', val: p1, set: setP1, color: 'border-gold', id: 'p1' }, 
            { label: 'Second P2', val: p2, set: setP2, color: 'border-silver', id: 'p2' }, 
            { label: 'Third P3', val: p3, set: setP3, color: 'border-bronze', id: 'p3' }, 
            { label: 'Pole Pos', val: pole, set: setPole, color: 'border-primary', id: 'pole' } 
        ].map(({label, val, set, color, id}) => {
            const isPodiumPos = id === 'p1' || id === 'p2' || id === 'p3';
            const selectedPodiumDrivers = [p1, p2, p3].filter(p => p !== '');
            return (
                <div key={label} className="space-y-1">
                  <label className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">{label}</label> 
                  <Select 
                    value={val} onChange={(e) => set(e.target.value)} required 
                    className={`w-full !py-2 !text-xs border-l-2 ${color} ${val ? 'bg-primary/5' : ''}`}
                  >
                    <option value="" disabled>Select Driver</option>
                    {drivers.map(driver => (
                        <option key={driver.id} value={driver.id} disabled={isPodiumPos && selectedPodiumDrivers.includes(driver.id) && val !== driver.id}>
                            {driver.name}
                        </option>
                    ))}
                  </Select>
                </div>
            );
        })}
        {submitError && <p className="text-primary text-[10px] text-center font-bold uppercase animate-pulse">{submitError}</p>}
        <Button type="submit" className="w-full mt-4 !py-3" disabled={isSubmitting}>
          {isSubmitting ? 'Transmitting...' : 'Confirm Vote'}
        </Button>
      </form>
    );
  }

  return (
    <Card className={`f1-glow-hover animate-f1-reveal border-t-2 ${isRaceFinished ? 'border-t-white/20' : hasVoted ? 'border-t-primary' : 'border-t-primary'} relative`}>
        {/* HUD Corners */}
        <div className="hud-corner top-0 left-0 border-t-2 border-l-2"></div>
        <div className="hud-corner top-0 right-0 border-t-2 border-r-2"></div>
        <div className="hud-corner bottom-0 left-0 border-b-2 border-l-2"></div>
        <div className="hud-corner bottom-0 right-0 border-b-2 border-r-2"></div>

        <CardHeader className="pb-4 relative">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-mono text-primary bg-primary/10 px-1 font-bold">RACE_{race.id.split('-')[1]}</span>
                        <span className="text-[8px] font-mono text-text-muted italic uppercase">ID: {race.id}</span>
                    </div>
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tighter leading-none">{race.name}</CardTitle>
                    <p className="text-[9px] font-bold text-text-muted mt-2 tracking-[0.1em]">{race.date} // {race.year}</p>
                </div>
                {!isRaceFinished && !isVotingClosed && <CountdownDisplay date={race.date} />}
            </div>
            
            <div className="flex gap-2 mt-4">
                {hasVoted && <span className="bg-primary text-white text-[8px] font-black px-2 py-0.5 italic skew-x-[-12deg]">DATA_SYNCED</span>}
                {isRaceFinished ? (
                    <span className="border border-white/20 text-white/40 text-[8px] font-black px-2 py-0.5 italic skew-x-[-12deg]">FINALIZED</span>
                ) : isVotingClosed ? (
                    <span className="bg-white/10 text-white/60 text-[8px] font-black px-2 py-0.5 italic skew-x-[-12deg]">LOCKED</span>
                ) : (
                    <span className="bg-primary/20 text-primary text-[8px] font-black px-2 py-0.5 italic skew-x-[-12deg] animate-pulse">LIVE_OPEN</span>
                )}
            </div>
        </CardHeader>
        <CardContent className="pt-2 pb-8">
            {renderContent()}
        </CardContent>
    </Card>
  );
}
