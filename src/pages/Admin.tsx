import { useData } from '../context/DataContext';
import RaceResultRow from '../components/RaceResultRow';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableHeader, TableBody, Th } from '../components/ui/Table';
import UserManagement from '../components/UserManagement';
import AdminVoteManagement from '../components/AdminVoteManagement'; // Import AdminVoteManagement component

export default function Admin() {
  const { races, drivers, loading } = useData();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-white text-center uppercase tracking-tight">Admin Panel</h1> 
      
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
                <Th>Result</Th>
                <Th className="text-right">Actions</Th>
              </TableHeader>
              <TableBody>
                {races.map(race => (
                  <RaceResultRow key={race.id} race={race} drivers={drivers} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UserManagement />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage User Votes</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminVoteManagement />
        </CardContent>
      </Card>
    </div>
  );
}