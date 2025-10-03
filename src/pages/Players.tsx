import React from 'react';
import DataTable from '../components/DataTable';
import { topPlayersData } from '../data/mockData';
import './Players.css';

const Players: React.FC = () => {
  // Extended player data for the players page
  const extendedPlayersData = [
    ...topPlayersData,
    {
      id: 6,
      name: 'NightRider',
      email: 'night@email.com',
      level: 91,
      score: 2234567,
      status: 'Active',
      joinDate: '2023-04-12',
      lastPlayed: '2024-09-28'
    },
    {
      id: 7,
      name: 'FirePhoenix',
      email: 'fire@email.com',
      level: 76,
      score: 1876543,
      status: 'Inactive',
      joinDate: '2023-08-25',
      lastPlayed: '2024-09-20'
    },
    {
      id: 8,
      name: 'IceWarden',
      email: 'ice@email.com',
      level: 89,
      score: 2098765,
      status: 'Active',
      joinDate: '2023-06-14',
      lastPlayed: '2024-09-28'
    },
    {
      id: 9,
      name: 'ShadowHunter',
      email: 'shadow@email.com',
      level: 84,
      score: 1765432,
      status: 'Pending',
      joinDate: '2023-09-08',
      lastPlayed: '2024-09-26'
    },
    {
      id: 10,
      name: 'VoidMaster',
      email: 'void@email.com',
      level: 93,
      score: 2456789,
      status: 'Active',
      joinDate: '2023-02-28',
      lastPlayed: '2024-09-28'
    }
  ];

  const playerColumns = [
    {
      key: 'name',
      title: 'Player Name',
      sortable: true,
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
    },
    {
      key: 'level',
      title: 'Level',
      sortable: true,
    },
    {
      key: 'score',
      title: 'Score',
      sortable: true,
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => (
        <span className={`status-badge status-badge-${value.toLowerCase()}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'joinDate',
      title: 'Join Date',
      sortable: true,
    },
    {
      key: 'lastPlayed',
      title: 'Last Played',
      sortable: true,
    },
  ];

  return (
    <div className="players-page">
      <div className="players-header">
        <div className="players-stats">
          <div className="players-stat-card">
            <h3>Total Players</h3>
            <p className="stat-number">147,832</p>
            <span className="stat-change positive">+12.5% this month</span>
          </div>
          <div className="players-stat-card">
            <h3>Active Today</h3>
            <p className="stat-number">45,231</p>
            <span className="stat-change positive">+8.7% from yesterday</span>
          </div>
          <div className="players-stat-card">
            <h3>New This Week</h3>
            <p className="stat-number">3,892</p>
            <span className="stat-change positive">+15.2% from last week</span>
          </div>
          <div className="players-stat-card">
            <h3>Retention Rate</h3>
            <p className="stat-number">78.5%</p>
            <span className="stat-change negative">-2.1% this month</span>
          </div>
        </div>
      </div>

      <div className="players-table">
        <DataTable
          title="All Players"
          columns={playerColumns}
          data={extendedPlayersData}
        />
      </div>
    </div>
  );
};

export default Players;
