import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Gamepad2, CheckCircle, X, Edit3, Settings, Upload } from 'lucide-react';
import Table from '../components/Table';
import StatsCard from '../components/StatsCard';
import ConfirmationModal from '../components/ConfirmationModal';
import ToggleSwitch from '../components/ToggleSwitch';
import GameEditModal from '../components/GameEditModal';
import { useTenant } from '../contexts/TenantContext';

import { useGetClientGamesQuery, useUpdateClientGameStatusMutation, useUpdateGameMutation, useUpdateClientGameInfoMutation, usePublishClientGamesMutation } from '../store/api/gamesApi';
import './Games.css';

const Games: React.FC = () => {
  const navigate = useNavigate();
  const { selectedTenantId } = useTenant();
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [gameToToggle, setGameToToggle] = useState<{ id: number; currentStatus: string; title: string } | null>(null);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [gameToActivate, setGameToActivate] = useState<{ clientGameId: string; currentActive: boolean; title: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ status: 'success' | 'error'; message: string } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [gameToEdit, setGameToEdit] = useState<{ id: string; title: string; description: string } | null>(null);
  
  // Array of dummy game images to randomly assign
  const dummyImages = [
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1556438064-2d7646166914?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=100&h=100&fit=crop&crop=center'
  ];

  // Function to get random image for a game (consistent per game ID)
  const getRandomImage = (gameId: string | number) => {
    // Convert string IDs to numbers using a simple hash
    let numericId: number;
    if (typeof gameId === 'string') {
      // Simple hash function for string IDs
      let hash = 0;
      for (let i = 0; i < gameId.length; i++) {
        const char = gameId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      numericId = Math.abs(hash);
    } else {
      numericId = gameId;
    }

    // Use numeric ID to ensure consistent image assignment for the same game
    const index = numericId % dummyImages.length;
    return dummyImages[index];
  };
  




  // Get client-specific games (only call when tenant is selected)
  const { 
    data: apiClientGames, 
    isLoading: isLoadingClientGames, 
    error: clientGamesError
  } = useGetClientGamesQuery(selectedTenantId, {
    skip: !selectedTenantId, // Skip the query when no tenant is selected
  });
  
  // Mutation for updating client game status
  const [updateClientGameStatus, { isLoading: isUpdatingStatus }] = useUpdateClientGameStatusMutation();
  
  // Mutation for updating game status
  const [updateGame, { isLoading: isUpdatingGameStatus }] = useUpdateGameMutation();
  
  // Mutation for updating client game info (title and description)
  const [updateClientGameInfo, { isLoading: isUpdatingGameInfo }] = useUpdateClientGameInfoMutation();

  // Mutation for publishing client games configuration
  const [publishClientGames, { isLoading: isPublishing }] = usePublishClientGamesMutation();

  // Use only client games data - no general games API call
  const clientGames = selectedTenantId ? (apiClientGames?.length ? apiClientGames : []) : [];
  const totalGames = selectedTenantId ? clientGames.length : 0;
  const activeGames = selectedTenantId ? clientGames.filter(cg => cg.isActive).length : 0;

  // Debug: Log the actual client games data
  console.log('=== GAMES DEBUG ===');
  console.log('Client Games data:', clientGames);
  console.log('First client game structure:', clientGames?.[0]);
  console.log('Current Tenant ID:', selectedTenantId);
  console.log('Is loading client games:', isLoadingClientGames);
  console.log('Client error:', clientGamesError);
  console.log('==================');

  // Handle show/hide game toggle - show confirmation first
  const handleToggleGameVisibility = (clientGameId: string, currentStatus: boolean, gameTitle: string) => {
    setGameToActivate({ clientGameId, currentActive: currentStatus, title: gameTitle });
    setShowActivationModal(true);
  };

  // Confirm activation/deactivation
  const handleConfirmActivation = async () => {
    if (!gameToActivate) return;

    try {
      if (apiClientGames?.length) {
        // Find the game data to get tenantId and gameId
        const gameData = tableData.find(row => row.clientGameId === gameToActivate.clientGameId);
        
        if (!gameData) {
          console.error('Game data not found for activation');
          return;
        }
        console.log(gameData)

        // Use real API if available
        await updateClientGameStatus({
          tenantId: gameData.tenantId,
          gameId: gameData.id, // This is the game UUID
          isActive: !gameToActivate.currentActive,
        }).unwrap();
        console.log('Game visibility updated successfully');
        
        // Show success toast
        const action = gameToActivate.currentActive ? 'deactivated' : 'activated';
        setToastMessage({
          status: 'success',
          message: `Game "${gameToActivate.title}" has been ${action} successfully.`
        });
        
        // Auto-hide toast after 3 seconds
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        // Show demo behavior with mock data
        console.log(`Demo: Would ${gameToActivate.currentActive ? 'hide' : 'show'} game with client ID ${gameToActivate.clientGameId}`);
        
        // Show demo success toast instead of alert
        const action = gameToActivate.currentActive ? 'deactivated' : 'activated';
        setToastMessage({
          status: 'success',
          message: `Demo: Game "${gameToActivate.title}" would be ${action}.`
        });
        
        // Auto-hide toast after 3 seconds
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (error) {
      console.error('Failed to update game visibility:', error);
      
      // Show error toast instead of alert
      const action = gameToActivate.currentActive ? 'deactivate' : 'activate';
      setToastMessage({
        status: 'error',
        message: `Failed to ${action} game "${gameToActivate.title}". Please try again.`
      });
      
      // Auto-hide toast after 5 seconds for errors
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setShowActivationModal(false);
      setGameToActivate(null);
    }
  };

  // Close activation modal
  const handleCloseActivationModal = () => {
    setShowActivationModal(false);
    setGameToActivate(null);
  };

  const handleConfirmStatusToggle = async () => {
    if (!gameToToggle) return;

    try {
      const newStatus = gameToToggle.currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      
      await updateGame({
        id: gameToToggle.id,
        updates: { status: newStatus }
      }).unwrap();
      
      console.log(`Game status updated to ${newStatus}`);
      setShowConfirmModal(false);
      setGameToToggle(null);
    } catch (error) {
      console.error('Failed to update game status:', error);
      alert('Error updating game status. Please check the API connection.');
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setGameToToggle(null);
  };

  // Handle edit game info
  const handleEditGameInfo = (clientGameId: string, currentTitle: string, currentDescription: string) => {
    setGameToEdit({ 
      id: clientGameId, 
      title: currentTitle || '', 
      description: currentDescription || '' 
    });
    setShowEditModal(true);
  };

  // Handle save edit changes
  const handleSaveEditChanges = async (data: { title: string; description: string }) => {
    if (!gameToEdit) return;

    try {
      // Find the game data to get tenantId and gameId
      const gameData = tableData.find(row => row.clientGameId === gameToEdit.id);
      
      if (!gameData) {
        console.error('Game data not found for edit');
        return;
      }

      await updateClientGameInfo({
        tenantId: gameData.tenantId,
        gameId: gameData.id, // This is the game UUID
        title: data.title,
        description: data.description,
      }).unwrap();

      setToastMessage({
        status: 'success',
        message: `Game "${data.title}" has been updated successfully.`
      });

      setShowEditModal(false);
      setGameToEdit(null);
      
      // Auto-hide toast after 3 seconds
      setTimeout(() => setToastMessage(null), 3000);
    } catch (error) {
      console.error('Failed to update game info:', error);
      setToastMessage({
        status: 'error',
        message: `Failed to update game information. Please try again.`
      });
      
      // Auto-hide toast after 5 seconds for errors
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setGameToEdit(null);
  };

  const handleCreateGameRule = (gameId: string, gameTitle: string) => {
    // Navigate to rule creation page with game details as URL params
    const tenantId = selectedTenantId; // Get current tenant ID
    console.log('Creating rule for game:', { gameId, gameTitle, tenantId, selectedTenantId });

    if (!tenantId || tenantId === 'undefined' || tenantId === '') {
      console.error('No valid tenant selected, cannot create rule. Current tenantId:', tenantId);
      alert('Please select a tenant first before creating game rules.');
      return;
    }

    // Find the game UUID from the table data
    const gameData = tableData.find(row => row.clientGameId === gameId);
    const gameUuid = gameData?.id; // This is the game UUID without prefix
    console.log('Game data found:', gameData, 'gameUuid:', gameUuid);

    if (!gameUuid) {
      console.error('Game UUID not found for gameId:', gameId);
      alert('Game data not found. Please try again.');
      return;
    }

    const url = `/games/create-rule?gameId=${gameUuid}&gameTitle=${encodeURIComponent(gameTitle)}&tenantId=${encodeURIComponent(tenantId)}`;
    console.log('Navigating to:', url);
    navigate(url);
  };



  // Compute table data from client games ONLY when tenant ID is provided
  const tableData = selectedTenantId && clientGames && clientGames.length > 0 ?
    clientGames.map(clientGame => ({
      id: clientGame.gameId,
      title: (clientGame as any).title || clientGame.game?.title || 'Unknown Game',
      description: (clientGame as any).description || clientGame.game?.description || '',
      gameType: clientGame.game?.gameType || 'UNKNOWN',
      url: clientGame.game?.url || '#',
      status: clientGame.game?.status || 'UNKNOWN',
      isActive: clientGame.isActive,
      clientGameId: clientGame.gameId,
      tenantId: clientGame.tenantId,
      createdAt: clientGame.createdAt,
      tenantName: (clientGame as any).tenant?.name,
      imageUrl: getRandomImage(clientGame.game?.gameId || clientGame.gameId || 'default')
    })) : [];

  // Debug: Log table data
  console.log('Table data sample:', tableData?.[0]);

  const gameColumns = [
    {
      key: 'title',
      title: 'Game',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="game-title-cell">
          <div className="game-title-row">
            <img 
              src={row.imageUrl} 
              alt={row.title} 
              className="game-image-inline"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop&crop=center";
              }}
            />
            <div className="game-title-content">
              <span className="game-title-text">{value}</span>
              {row.description && (
                <div className="game-description">{row.description}</div>
              )}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: 'isActive',
      title: 'Status',
      sortable: true,
      render: (value: boolean, row: any) => (
        <div className="status-cell">
          <ToggleSwitch
            checked={value}
            onChange={() => handleToggleGameVisibility(row.clientGameId, value, row.title)}
            disabled={isUpdatingStatus}
            size="md"
            showLabels={false}
          />
        </div>
      ),
    },

    {
      key: 'url',
      title: 'Game URL',
      render: (value: string) => (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="game-url"
        >
          <span className="url-icon">🔗</span>
          {value.length > 35 ? `${value.substring(0, 35)}...` : value}
        </a>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created At',
      sortable: true,
      render: (value: string) => (
        <div className="date-cell">
          <span className="date-primary">{new Date(value).toLocaleDateString()}</span>
          <span className="date-secondary">{new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
    },
    {
      key: 'description',
      title: 'Description',
      render: (value: string | null) => (
        <span className="game-description">
          {value || 'No description'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_value: any, row: any) => (
        <div className="actions-cell">
          <button
            className="edit-btn"
            onClick={() => handleEditGameInfo(row.clientGameId, row.title, row.description)}
            disabled={isUpdatingGameInfo}
            title="Edit game information"
          >
            <Edit3 size={16} />
          </button>
          <button
            className="rule-btn"
            onClick={() => handleCreateGameRule(row.clientGameId, row.title)}
            disabled={isUpdatingGameInfo}
            title="Create game rule"
          >
            <Settings size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Calculate visibility stats
  const visibleGames = clientGames?.filter(cg => cg.isActive).length || 0;
  const configuredGames = clientGames?.length || 0;

  // No default loading state needed since we don't load games by default

  // Show basic info even if client games are still loading
  console.log('Rendering games page with data:', { totalGames, activeGames, isLoadingClientGames });

  return (
    <div className="games-page">
      <div className="games-stats">
        <StatsCard
          title="Total Games"
          value={totalGames}
          change="0"
          changeType="neutral"
          icon={Gamepad2}
          color="blue"
          animated={true}
        />
        
        <StatsCard
          title="Visible Games"
          value={visibleGames}
          change={configuredGames > 0 ? Math.round((visibleGames / configuredGames) * 100).toString() : "0"}
          changeType={visibleGames > 0 ? "positive" : "neutral"}
          icon={Eye}
          color="green"
          animated={true}
        />
        
        <StatsCard
          title="Configured Games"
          value={configuredGames.toString()}
          change={totalGames > 0 ? Math.round((configuredGames / totalGames) * 100).toString() : "0"}
          changeType={configuredGames > 0 ? "positive" : "neutral"}
          icon={Eye}
          color="purple"
        />
        
        <StatsCard
          title="Active Rate"
          value={`${Math.round((activeGames / totalGames) * 100) || 0}%`}
          change={activeGames > (totalGames / 2) ? "5" : "-2"}
          changeType={activeGames > (totalGames / 2) ? "positive" : "negative"}
          icon={Gamepad2}
          color="orange"
        />
      </div>

      {/* Games Table with integrated tenant input */}
      <div className="games-table">
        <div className="table-header-with-input">
          <h3 className="table-title-custom">Game Library</h3>
          <div className="header-controls">
            {selectedTenantId && (
              <button
                className="view-config-btn"
                onClick={async () => {
                  try {
                    await publishClientGames(selectedTenantId).unwrap();

                    setToastMessage({
                      status: 'success',
                      message: `Game configuration published successfully for tenant ${selectedTenantId}.`
                    });
                  } catch (error) {
                    console.error('Failed to publish game configuration:', error);
                    setToastMessage({
                      status: 'error',
                      message: `Failed to publish game configuration. Please try again.`
                    });
                  }

                  // Auto-hide toast after 3 seconds for success, 5 seconds for error
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                disabled={isPublishing}
                title={`Publish game configuration for tenant ${selectedTenantId}`}
              >
                <Upload size={16} />
                {isPublishing ? 'Publishing...' : 'Publish'}
              </button>
            )}
          </div>
        </div>
        <Table
          columns={gameColumns}
          data={tableData}
          loading={isLoadingClientGames}
          emptyMessage={
            selectedTenantId ? 
              `No games found for selected tenant` : 
              "Please select a tenant from the header to view games"
          }
          defaultSortKey="title"
          defaultSortOrder="asc"
          defaultItemsPerPage={10}
          showPagination={true}
        />
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmStatusToggle}
        title="Change Game Status"
        message={
          gameToToggle
            ? `Are you sure you want to ${gameToToggle.currentStatus === 'ACTIVE' ? 'deactivate' : 'activate'} the game "${gameToToggle.title}"?`
            : ''
        }
        confirmText={gameToToggle?.currentStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        cancelText="Cancel"
        isLoading={isUpdatingGameStatus}
        type={gameToToggle?.currentStatus === 'ACTIVE' ? 'warning' : 'info'}
      />

      <ConfirmationModal
        isOpen={showActivationModal}
        onClose={handleCloseActivationModal}
        onConfirm={handleConfirmActivation}
        title="Change Game Status"
        message={
          gameToActivate
            ? `Are you sure you want to ${gameToActivate.currentActive ? 'deactivate' : 'activate'} the game "${gameToActivate.title}"?`
            : ''
        }
        confirmText={gameToActivate?.currentActive ? 'Deactivate' : 'Activate'}
        cancelText="Cancel"
        isLoading={isUpdatingStatus}
        type={gameToActivate?.currentActive ? 'warning' : 'info'}
      />

      {/* Game Edit Modal */}
      <GameEditModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditChanges}
        gameTitle={gameToEdit?.title || ''}
        gameDescription={gameToEdit?.description || ''}
        isLoading={isUpdatingGameInfo}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast ${toastMessage.status === 'success' ? 'toast-success' : 'toast-error'}`}>
          <div className="toast-content">
            {toastMessage.status === 'success' ? (
              <CheckCircle className="toast-icon" size={20} />
            ) : (
              <X className="toast-icon" size={20} />
            )}
            <span>{toastMessage.message}</span>
          </div>
          <button 
            className="toast-close"
            onClick={() => setToastMessage(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Games;
