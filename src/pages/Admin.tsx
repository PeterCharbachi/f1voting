import { useState } from 'react';
import { useData } from '../context/DataContext';
import RaceResultRow from '../components/RaceResultRow';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableHeader, TableBody, Th } from '../components/ui/Table';
import UserManagement from '../components/UserManagement';
import AdminVoteManagement from '../components/AdminVoteManagement';
import DriverManagement from '../components/DriverManagement';
import RaceManagement from '../components/RaceManagement';

const TabButton = ({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button 
      onClick={onClick} 
      className={`py-2 px-4 text-sm font-semibold rounded-t-lg transition-colors duration-300 ${isActive ? 'bg-background-medium text-primary' : 'bg-background-light text-text-muted hover:bg-background-medium'}`}> 
      {children}
  </button>
);

export default function Admin() {
  const { races, drivers, loading } = useData();
  const [activeTab, setActiveTab] = useState('results');

  const renderContent = () => {
    switch (activeTab) {
      case 'results':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Manage Race Results</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <p className="text-center py-8 text-text-muted">Loading race data...</p> 
              ) : (
                <Table>
                  <TableHeader>
                    <Th>Race</Th>
                    <Th>Date</Th>
                    <Th>Result (1,2,3,P)</Th>
                    <Th className="text-right">Actions</Th>
                  </TableHeader>
                  <TableBody>
                    {races.filter(r => r.year === 2026).map(race => (
                      <RaceResultRow key={race.id} race={race} drivers={drivers} />
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        );
      case 'users':
        return <UserManagement />;
      case 'votes':
        return <AdminVoteManagement />;
      case 'races':
        return <RaceManagement />;
      case 'drivers':
        return <DriverManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-white text-center uppercase tracking-tight">Admin Panel</h1> 
      
      <div className="flex flex-wrap space-x-2 px-6 border-b border-background-light">
          <TabButton isActive={activeTab === 'results'} onClick={() => setActiveTab('results')}>Results</TabButton>
          <TabButton isActive={activeTab === 'races'} onClick={() => setActiveTab('races')}>Races</TabButton>
          <TabButton isActive={activeTab === 'drivers'} onClick={() => setActiveTab('drivers')}>Drivers</TabButton>
          <TabButton isActive={activeTab === 'users'} onClick={() => setActiveTab('users')}>Users</TabButton>
          <TabButton isActive={activeTab === 'votes'} onClick={() => setActiveTab('votes')}>User Votes</TabButton>
      </div>

      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
}