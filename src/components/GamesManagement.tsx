import React, { useState } from 'react';
import { useGames, useGamesByStatus, useGameMutations } from '../hooks/useGames';
import GameForm from './GameForm';
import type { Game } from '../store/api/gamesApi';

const GamesManagement: React.FC = () => {
  const { games, isLoading, refetch } = useGames();
  const { games: activeGames } = useGamesByStatus('ACTIVE');
  const { handleDeleteGame, isDeleting } = useGameMutations();
  
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      const result = await handleDeleteGame(id);
      if (result.success) {
        alert('Game deleted successfully!');
      } else {
        alert('Failed to delete game');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingGame(null);
    refetch(); // Refresh the games list
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingGame(null);
  };

  if (showForm) {
    return (
      <GameForm
        mode={editingGame ? 'edit' : 'create'}
        initialData={editingGame || undefined}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  if (isLoading) {
    return <div>Loading games...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Games Management</h1>
        <button 
          onClick={() => setShowForm(true)}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Add New Game
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Quick Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
            <h3>Total Games</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{games.length}</p>
          </div>
          <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
            <h3>Active Games</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{activeGames.length}</p>
          </div>
        </div>
      </div>

      <div>
        <h2>All Games</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {games.map((game) => (
            <div key={game.id} style={{ 
              padding: '1rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{game.title}</h3>
                <p style={{ margin: '0', color: '#6b7280', fontSize: '0.875rem' }}>
                  {game.description || 'No description'}
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem' }}>
                  <span style={{ 
                    background: game.status === 'ACTIVE' ? '#dcfce7' : '#fef3c7',
                    color: game.status === 'ACTIVE' ? '#166534' : '#92400e',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    marginRight: '0.5rem'
                  }}>
                    {game.status}
                  </span>
                  <span>{game.gameType.replace('_', ' ')}</span>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEdit(game)}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: '#f59e0b', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(game.id)}
                  disabled={isDeleting}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: '#ef4444', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    opacity: isDeleting ? 0.6 : 1
                  }}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesManagement;
