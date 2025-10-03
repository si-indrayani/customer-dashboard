import { useMemo } from 'react';
import {
  useGetGamesQuery,
  useGetGameQuery,
  useCreateGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
  useGetGamesByStatusQuery,
} from '../store/api/gamesApi';
import type { Game } from '../store/api/gamesApi';

// Custom hook for getting all games with additional computed data
export const useGames = () => {
  const {
    data: games = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetGamesQuery();

  // Memoized computed values
  const computedData = useMemo(() => {
    const activeGames = games.filter(game => game.status === 'ACTIVE');
    const deprecatedGames = games.filter(game => game.status === 'DEPRECATED');
    const inactiveGames = games.filter(game => game.status === 'INACTIVE');
    
    const gamesByType = games.reduce((acc, game) => {
      acc[game.gameType] = (acc[game.gameType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalGames: games.length,
      activeGamesCount: activeGames.length,
      deprecatedGamesCount: deprecatedGames.length,
      inactiveGamesCount: inactiveGames.length,
      activeGames,
      deprecatedGames,
      inactiveGames,
      gamesByType,
      hostedLinksCount: gamesByType.HOSTED_LINK || 0,
      uploadedBuildsCount: gamesByType.UPLOADED_BUILD || 0,
    };
  }, [games]);

  return {
    games,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    ...computedData,
  };
};

// Custom hook for getting games by status
export const useGamesByStatus = (status: string) => {
  const {
    data: games = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetGamesByStatusQuery(status);

  return {
    games,
    isLoading,
    isError,
    error,
    refetch,
    count: games.length,
  };
};

// Custom hook for getting a single game
export const useGame = (id: number) => {
  const {
    data: game,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetGameQuery(id);

  return {
    game,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// Custom hook for game mutations with enhanced functionality
export const useGameMutations = () => {
  const [createGame, createGameResult] = useCreateGameMutation();
  const [updateGame, updateGameResult] = useUpdateGameMutation();
  const [deleteGame, deleteGameResult] = useDeleteGameMutation();

  const handleCreateGame = async (gameData: Partial<Game>) => {
    try {
      const result = await createGame(gameData).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleUpdateGame = async (id: number, updates: Partial<Game>) => {
    try {
      const result = await updateGame({ id, updates }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleDeleteGame = async (id: number) => {
    try {
      const result = await deleteGame(id).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    // Raw mutations
    createGame,
    updateGame,
    deleteGame,
    
    // Enhanced handlers
    handleCreateGame,
    handleUpdateGame,
    handleDeleteGame,
    
    // Mutation states
    isCreating: createGameResult.isLoading,
    isUpdating: updateGameResult.isLoading,
    isDeleting: deleteGameResult.isLoading,
    
    createError: createGameResult.error,
    updateError: updateGameResult.error,
    deleteError: deleteGameResult.error,
  };
};

// Custom hook for games statistics
export const useGamesStats = () => {
  const { games, isLoading } = useGames();

  const stats = useMemo(() => {
    if (isLoading || !games.length) {
      return {
        totalGames: 0,
        activeGames: 0,
        hostedLinks: 0,
        uploadedBuilds: 0,
        recentGames: 0,
        averageGamesPerMonth: 0,
      };
    }

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const recentGames = games.filter(game => 
      new Date(game.createdAt) >= lastMonth
    ).length;

    // Calculate average games per month (rough estimate)
    const oldestGame = games.reduce((oldest, game) => 
      new Date(game.createdAt) < new Date(oldest.createdAt) ? game : oldest
    );
    
    const monthsDiff = Math.max(1, 
      (now.getTime() - new Date(oldestGame.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    const averageGamesPerMonth = Math.round(games.length / monthsDiff * 10) / 10;

    return {
      totalGames: games.length,
      activeGames: games.filter(g => g.status === 'ACTIVE').length,
      hostedLinks: games.filter(g => g.gameType === 'HOSTED_LINK').length,
      uploadedBuilds: games.filter(g => g.gameType === 'UPLOADED_BUILD').length,
      recentGames,
      averageGamesPerMonth,
    };
  }, [games, isLoading]);

  return {
    ...stats,
    isLoading,
  };
};
